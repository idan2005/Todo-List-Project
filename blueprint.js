const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');
document.getElementById('project_name').textContent = ` ${projectName} - Kanban Board`;

 

window.onload = function() {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    let todoTasksList = document.getElementById('todoList');
    let inProgressTaskList = document.getElementById('todoList');
    let doneTaskList = document.getElementById('todoList');
    project.todoList.forEach(task => {
        let li = newTaskListItem(task, 'todo');
        todoTasksList.appendChild(li);
    });
    project.inProgressList.forEach(task => {
        let li = newTaskListItem(task, 'inProgress');
        inProgressTaskList.appendChild(li);
    });
    project.doneList.forEach(task => {
        let li = newTaskListItem(task, 'done');
        doneTaskList.appendChild(li);
    });
};
function newTaskListItem(taskName) {
    let li = document.createElement('li');
    li.type = 'text';
    li.className = 'task_list_item';
    li.textContent = taskName;

    let img = document.createElement('img');
    img.src = 'icons/garbage.png';
    img.alt = 'garbage';
    img.className = 'delete_icon';
    img.addEventListener('click', function() {
        removeTask(taskName, li.parentElement);
        li.remove();
    });
    li.appendChild(img);
    return li;
}
 
document.getElementById('addTask').onclick = function() {
    let taskName =document.getElementById('input_task_name').value;
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    if (!taskName) {
        alert('Please enter a task name.');
        return;
    }
    project.todoList.push(taskName);
    document.getElementById('input_task_name').value = '';

    let newListItem = newTaskListItem(taskName);
    let todoList =  document.getElementById('todoList');
    todoList.appendChild(newListItem);
    saveProjects(projects);
}

document.getElementById('btnDeleteProject').onclick = function() {
    if (!projectName) {
        alert('No project selected.');
        return;
    }
    console.log(`Deleting project: ${projectName}`);
    if (confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
        let projects = loadProjects();
        projects = projects.filter(project => project.name !== projectName);
        saveProjects(projects);
        window.location.href = 'projects.html';
    }
}

function removeTask(taskName, listType) {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    console.log(`Removing task: ${taskName} from list: ${listType.id}`);
    project[listType.id].splice(project[listType.id].indexOf(taskName), 1);
    saveProjects(projects);
}
