document.getElementById('addTask').onclick = function() {
    let taskName =document.getElementById('input_task_name').value;
    if (!task) {
        alert('Please enter a task name.');
        return;
    }
    let newListItem = getNewListItem(taskName);
    let todoList =  document.getElementById('todoList');
    todoList.push(newListItem);
}
getNewListItem = function(taskName) {
    let li = document.createElement('li');
    li.className = 'task_list_item';
    li.textContent = taskName;
    let btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'delete_task';
    btn.onclick = function() {
        li.remove();
        removeTask(task);
    };
        let img = document.createElement('img');
    img.src = 'icons/garbage.png';
    img.alt = 'garbage';
    img.className = 'delete_icon';
    btn.appendChild(img);
    li.appendChild(btn);
    return li;
}