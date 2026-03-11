// ===== THEME MANAGEMENT =====
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

function loadTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    html.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
});

// ===== GREETING & TIME =====
const timeDisplay = document.getElementById('timeDisplay');
const dateDisplay = document.getElementById('dateDisplay');
const greeting = document.getElementById('greeting');
const nameBtn = document.getElementById('nameBtn');

function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = now.toLocaleDateString('en-US', options);
}

function updateGreeting() {
    const hour = new Date().getHours();
    const userName = localStorage.getItem('userName') || 'Hasna';
    let greetingText = '';
    if (hour < 12) {
        greetingText = 'Good Morning';
    } else if (hour < 18) {
        greetingText = 'Good Afternoon';
    } else {
        greetingText = 'Good Evening';
    }
    greeting.textContent = `${greetingText}, ${userName}!`;
}

// ===== FOCUS TIMER =====
const timerDisplay = document.getElementById('timerDisplay');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const resetBtn = document.getElementById('resetBtn');

let timerInterval = null;
let timeLeft = 25 * 60; // 25 minutes in seconds

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function updateTimerDisplay() {
    timerDisplay.textContent = formatTime(timeLeft);
}

startBtn.addEventListener('click', () => {
    if (timerInterval) return;

    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();

        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            timerInterval = null;
            alert('Focus session complete! Great job!');
            timeLeft = 25 * 60;
            updateTimerDisplay();
        }
    }, 1000);
});

stopBtn.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
});

resetBtn.addEventListener('click', () => {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timeLeft = 25 * 60;
    updateTimerDisplay();
});

// ===== TO-DO LIST =====
const todoInput = document.getElementById('todoInput');
const addTodoBtn = document.getElementById('addTodoBtn');
const todoList = document.getElementById('todoList');

let todos = [];

function loadTodos() {
    const savedTodos = localStorage.getItem('todos');
    todos = savedTodos ? JSON.parse(savedTodos) : [];
    renderTodos();
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function renderTodos() {
    todoList.innerHTML = '';

    // sort: incomplete first
    const sortedTodos = [...todos].sort((a, b) => a.completed - b.completed);

    sortedTodos.forEach((todo) => {

        const index = todos.indexOf(todo);

        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'todo-checkbox';
        checkbox.checked = todo.completed;
        checkbox.addEventListener('change', () => toggleTodo(index));

        const text = document.createElement('span');
        text.className = 'todo-text';
        text.textContent = todo.text;

        const actions = document.createElement('div');
        actions.className = 'todo-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'icon-btn';
        editBtn.textContent = '✏️';

        editBtn.addEventListener('click', () => startEdit(text, index));

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'icon-btn';
        deleteBtn.textContent = '🗑️';

        deleteBtn.addEventListener('click', () => deleteTodo(index));

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        li.appendChild(checkbox);
        li.appendChild(text);
        li.appendChild(actions);

        todoList.appendChild(li);
    });
}

function addTodo() {
    const text = todoInput.value.trim();
    if (!text) return;

    // Prevent duplicate tasks
    const isDuplicate = todos.some(todo => todo.text.toLowerCase() === text.toLowerCase());
    if (isDuplicate) {
        alert('This task already exists!');
        return;
    }

    todos.push({ text, completed: false });
    saveTodos();
    renderTodos();
    todoInput.value = '';
}

function toggleTodo(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
}

function startEdit(textElement, index) {
    const currentText = todos[index].text;
    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentText;
    input.className = 'edit-input';
    textElement.replaceWith(input);
    input.focus();

    function saveEdit() {
        const newText = input.value.trim();
        if (!newText) {
            renderTodos();
            return;
        }
        const isDuplicate = todos.some((todo, i) =>
            i !== index && todo.text.toLowerCase() === newText.toLowerCase()
        );
        if (isDuplicate) {
            alert("Task already exists!");
            renderTodos();
            return;
        }
        todos[index].text = newText;
        saveTodos();
        renderTodos();
    }
    input.addEventListener('keydown', (e) => {

        if (e.key === 'Enter') {
            saveEdit();
        }
        if (e.key === 'Escape') {
            renderTodos();
        }
    });
    input.addEventListener('blur', saveEdit);
}

function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
}

addTodoBtn.addEventListener('click', addTodo);
todoInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addTodo();
});

// ===== QUICK LINKS =====
const linkName = document.getElementById('linkName');
const linkUrl = document.getElementById('linkUrl');
const addLinkBtn = document.getElementById('addLinkBtn');
const linksList = document.getElementById('linksList');

let links = [];

function loadLinks() {
    const savedLinks = localStorage.getItem('links');
    links = savedLinks ? JSON.parse(savedLinks) : [];
    renderLinks();
}

function saveLinks() {
    localStorage.setItem('links', JSON.stringify(links));
}

function renderLinks() {
    linksList.innerHTML = '';
    links.forEach((link, index) => {
        const div = document.createElement('div');
        div.className = 'link-item';

        div.innerHTML = `
            <a href="${link.url}" target="_blank" rel="noopener noreferrer">${link.name}</a>
            <button class="delete-link" onclick="deleteLink(${index})">×</button>
        `;
        linksList.appendChild(div);
    });
}

function addLink() {
    const name = linkName.value.trim();
    const url = linkUrl.value.trim();

    if (!name || !url) {
        alert('Please enter both name and URL');
        return;
    }

    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        alert('URL must start with http:// or https://');
        return;
    }

    links.push({ name, url });
    saveLinks();
    renderLinks();
    linkName.value = '';
    linkUrl.value = '';
}

function deleteLink(index) {
    links.splice(index, 1);
    saveLinks();
    renderLinks();
}

addLinkBtn.addEventListener('click', addLink);

// ===== INITIALIZATION =====
loadTheme();
updateTime();
updateGreeting();
loadTodos();
loadLinks();

setInterval(updateTime, 1000);
setInterval(updateGreeting, 60000);
