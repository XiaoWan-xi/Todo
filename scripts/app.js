// app.js
function addTask() {
    const input = document.getElementById('taskInput');
    const taskList = document.getElementById('taskList');
    const taskText = input.value.trim();

    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    if (!input || !taskList) {
        console.error('taskInput or taskList element not found.');
        return;
    }

    const li = document.createElement('li');
    li.textContent = taskText;

    const completeButton = document.createElement('button');
    completeButton.textContent = 'Complete';
    completeButton.onclick = function () {
        li.style.textDecoration = 'line-through';
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.onclick = function () {
        li.remove();
    };

    li.appendChild(completeButton);
    li.appendChild(deleteButton);

    taskList.appendChild(li);
    input.value = '';
    input.focus(); // 将焦点重新设置到输入框上
}

// 添加键盘事件监听器
document.getElementById('taskInput').addEventListener('keydown', function(event) {
    if (event.keyCode === 13) { // 检测回车键
        addTask();
    }
});
