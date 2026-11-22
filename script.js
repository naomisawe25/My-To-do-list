const STORAGE_KEY = 'myTasks';
console.log(STORAGE_KEY);

// DOM Manipulation
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const message = document.getElementById('message');
const clearButton = document.getElementById('clear-button');
const emptyState = document.getElementById('empty-state');

let tasks = loadTasks();
console.log(tasks);

// Arrow Functions
taskForm.addEventListener('submit', (event) => {
  event.preventDefault();
  addTask();
});

taskList.addEventListener('change', (event) => {
  if (event.target.matches('input[type="checkbox"]')) {
    toggleTask(event.target.closest('[data-task-id]').dataset.taskId);
  }
});

taskList.addEventListener('click', (event) => {
  const deleteButton = event.target.closest('.delete-button');
  if (deleteButton) {
    deleteTask(deleteButton.closest('[data-task-id]').dataset.taskId);
  }
});

clearButton.addEventListener('click', () => {
  if (tasks.length > 0 && confirm('Are you sure you want to delete all tasks?')) {
    tasks = [];
    saveAndRender();
  }
});

function addTask() {
  const text = taskInput.value.trim();
  console.log('Entered tasks',text);

  if (!text) {
    message.textContent = 'Please enter a task before adding it.';
    taskInput.focus();
    return;
  }
  
// Arrays
  message.textContent = '';
  tasks.push({ id: crypto.randomUUID(), text, completed: false });
  console.log('Tasks after adding',tasks);
  taskInput.value = '';
  saveAndRender();
  taskInput.focus();
}
// Functions
function toggleTask(taskId) {
  tasks = tasks.map((task) =>
    task.id === taskId ? { ...task, completed: !task.completed } : task
  );
  saveAndRender();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveAndRender();
}

function renderTasks() {
  taskList.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement('li');
    item.className = `task-item${task.completed ? ' is-completed' : ''}`;
    item.dataset.taskId = task.id;

    const label = document.createElement('label');
    label.className = 'task-label';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.setAttribute('aria-label', `Mark "${task.text}" as complete`);

    const text = document.createElement('span');
    text.className = 'task-text';
    text.textContent = task.text;

    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-button';
    deleteButton.type = 'button';
    deleteButton.textContent = 'Delete';
    deleteButton.setAttribute('aria-label', `Delete "${task.text}"`);

    label.append(checkbox, text);
    item.append(label, deleteButton);
    taskList.append(item);
  });

  taskCount.textContent = `Total tasks: ${tasks.length}`;
  emptyState.hidden = tasks.length > 0;
  clearButton.disabled = tasks.length === 0;
}

function saveAndRender() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  renderTasks();
}

function loadTasks() {
  const savedTasks = localStorage.getItem(STORAGE_KEY);
  if (!savedTasks) {
    return [];
  }

  try {
    const parsedTasks = JSON.parse(savedTasks);
    if (Array.isArray(parsedTasks)) {
      return parsedTasks.filter(
        (task) =>
          task &&
          typeof task.id === 'string' &&
          typeof task.text === 'string' &&
          typeof task.completed === 'boolean'
      );
    }
  } catch (error) {
    console.error('Unable to load saved tasks from localStorage.', error);
    message.textContent = 'Saved tasks could not be loaded.';
  }

  return [];
}

renderTasks();
