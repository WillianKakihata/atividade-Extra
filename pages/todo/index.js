const taskKey = '@tasks';

let selectedTaskId = null;

// Função para adicionar tarefa
function addTask(event) {
  event.preventDefault(); // Evita o recarregamento da página
  const taskId = new Date().getTime();
  const taskList = document.querySelector('#taskList');

  const form = document.querySelector('#taskForm');
  const formData = new FormData(form);

  const taskTitle = formData.get('title');
  const taskDescription = formData.get('description');

  const li = document.createElement('li');

  li.id = `id-${taskId}`;
  li.innerHTML = `
    <div>
      <h2>${taskTitle}</h2>
      <p>${taskDescription}</p>
    </div>
    <button title="Editar tarefa" onClick="openEditDialog(${taskId})">✏️</button>
  `;

  taskList.appendChild(li);

  // Salvar tarefas no localStorage
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  tasks.push({
    id: taskId,
    title: taskTitle,
    description: taskDescription,
  });
  localStorage.setItem(taskKey, JSON.stringify(tasks));

  form.reset();
}

function openEditDialog(taskId) {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];

  selectedTaskId = tasks.findIndex((task) => task.id === taskId);
  const task = tasks[selectedTaskId];

  const dialog = document.querySelector('dialog');

  const editTitle = document.querySelector('#editTaskForm #title');
  const editDescription = document.querySelector('#editTaskForm #description');

  editTitle.value = task.title;
  editDescription.value = task.description;

  dialog.showModal();
}

function saveEdit(event) {
  event.preventDefault();

  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const task = tasks[selectedTaskId];

  const editForm = document.querySelector('#editTaskForm');
  const formData = new FormData(editForm);

  const newTitle = formData.get('title');
  const newDescription = formData.get('description');

  task.title = newTitle;
  task.description = newDescription;

  tasks[selectedTaskId] = task;
  localStorage.setItem(taskKey, JSON.stringify(tasks));

  const li = document.querySelector(`#id-${task.id}`);
  li.innerHTML = `
    <div>
      <h2>${newTitle}</h2>
      <p>${newDescription}</p>
    </div>
    <button title="Editar tarefa" onClick="openEditDialog(${task.id})">✏️</button>
  `;

  closeDialog();
}

function closeDialog() {
  const dialog = document.querySelector('dialog');
  dialog.close();
}

function filterTasks() {
  const filterText = document.querySelector('#filterTitle').value.toLowerCase();
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const filteredTasks = tasks.filter(task => task.title.toLowerCase().includes(filterText));
  
  const taskList = document.querySelector('#taskList');
  taskList.innerHTML = filteredTasks
    .map(
      (task) => `
      <li id='id-${task.id}'>
        <div>
          <h2>${task.title}</h2>
          <p>${task.description}</p>
        </div>
        <button title="Editar tarefa" onClick="openEditDialog(${task.id})">✏️</button>
      </li>
    `
    )
    .join('');
}

// Carregar tarefas do localStorage ao recarregar a página
window.addEventListener('DOMContentLoaded', () => {
  const tasks = JSON.parse(localStorage.getItem(taskKey)) || [];
  const taskList = document.querySelector('#taskList');

  taskList.innerHTML = tasks
    .map(
      (task) => `
      <li id='id-${task.id}'>
        <div>
          <h2>${task.title}</h2>
          <p>${task.description}</p>
        </div>
        <button title="Editar tarefa" onClick="openEditDialog(${task.id})">✏️</button>
      </li>
    `
    )
    .join('');
});

// Adicionando o evento de submit para o formulário de edição
document.querySelector('#editTaskForm').addEventListener('submit', saveEdit);