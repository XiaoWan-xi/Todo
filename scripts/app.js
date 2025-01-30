document.addEventListener('DOMContentLoaded', () => {
    loadTasks();
    updateCounter();
    resetCounterAtMidnight();

    // Add event listener for Enter key press
    document.getElementById('taskInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    document.getElementById('deadlineInput').addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});

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
        completed: false,
        completedDate: null // Initialize completedDate
    };

    saveTask(task);
    renderTask(task);

    input.value = '';
    deadlineInput.value = '';

    // Check if the task is overdue
    checkOverdueTasks();
    updateCounter();
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
        task.completedDate = new Date().toISOString(); // Add completion date
        updateTasks();
        updateCounter();
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
            completed: li.style.textDecoration === 'line-through',
            completedDate: li.style.textDecoration === 'line-through' ? new Date().toISOString() : null // Update completedDate
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

                    // Add delete button for overdue tasks if not already present
                    if (!task.querySelector('button.delete-overdue')) {
                        const deleteButton = document.createElement('button');
                        deleteButton.textContent = 'Delete';
                        deleteButton.classList.add('delete-overdue');
                        deleteButton.onclick = function () {
                            task.remove();
                            deleteTask({
                                text: taskText.split(' (Deadline: ')[0],
                                deadline: deadlineMatch[1]
                            });
                        };
                        task.appendChild(deleteButton);
                    }
                }
            }
        }
    });
}

// Call checkOverdueTasks periodically to update the status
setInterval(checkOverdueTasks, 60000); // Check every minute

function updateCounter() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    const completedTasks = tasks.filter(task => task.completed && isToday(new Date(task.completedDate))).length;
    document.getElementById('taskCounter').textContent = `Tasks completed today: ${completedTasks}`;
}

function isToday(date) {
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
}

function resetCounterAtMidnight() {
    const now = new Date();
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
    setTimeout(() => {
        localStorage.setItem('completedTasksToday', '0');
        updateCounter();
        resetCounterAtMidnight();
    }, msUntilMidnight);
}