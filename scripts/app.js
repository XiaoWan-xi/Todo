document.addEventListener('DOMContentLoaded', loadTasks);

function addTask() {
    const input = document.getElementById('taskInput');
    const deadlineInput = document.getElementById('deadlineInput');
    const taskText = input.value.trim();
    const deadlineText = deadlineInput.value.trim();

    if (!input) {
        console.error('taskInput element not found');
        return;
    }

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    const task = {
        text: taskText,
        deadline: deadlineText,
        completed: false
    };

    saveTask(task);
    renderTask(task);

    input.value = '';
    deadlineInput.value = '';

    // Check if the task is overdue
    checkOverdueTasks();
}

function saveTask(task) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => renderTask(task));
    checkOverdueTasks();
}

function renderTask(task) {
    const li = document.createElement('li');
    li.textContent = `${task.text} (Deadline: ${task.deadline})`;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.classList.add('complete');
    completeButton.onclick = function () {
        li.style.textDecoration = 'line-through';
        task.completed = true;
        updateTasks();
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        li.remove();
        deleteTask(task);
    };

    li.appendChild(completeButton);
    li.appendChild(deleteButton);

    const taskList = document.getElementById('taskList');
    if (!taskList) {
        console.error('taskList element not found');
        return;
    }

    taskList.appendChild(li);
}

function deleteTask(taskToDelete) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskToDelete.text || task.deadline !== taskToDelete.deadline);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTasks() {
    let tasks = [];
    document.querySelectorAll('#taskList li').forEach(li => {
        const taskText = li.childNodes[0].nodeValue;
        const deadlineMatch = taskText.match(/\(Deadline: (.+)\)/);
        const task = {
            text: taskText.split(' (Deadline: ')[0],
            deadline: deadlineMatch ? deadlineMatch[1] : '',
            completed: li.style.textDecoration === 'line-through'
        };
        tasks.push(task);
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function checkOverdueTasks() {
    const tasks = document.querySelectorAll('#taskList li');
    const now = new Date();

    tasks.forEach(task => {
        const taskText = task.childNodes[0].nodeValue;
        const deadlineMatch = taskText.match(/\(Deadline: (.+)\)/);
        if (deadlineMatch) {
            const deadline = new Date(deadlineMatch[1]);
            if (deadline < now) {
                task.style.color = 'red';
                if (!task.textContent.includes('(Overdue)')) {
                    task.textContent += ' (Overdue)';
                }
            }
        }
    });
}

// Call checkOverdueTasks periodically to update the status
setInterval(checkOverdueTasks, 60000); // Check every minute