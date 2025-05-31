const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');
document.getElementById('project_name').textContent = ` ${projectName} - Kanban Board`;



var projects = loadProjects();
var project = projects.find(p => p.name === projectName);
 

window.onload = function() {
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
function loadProjects () {
    let projects = JSON.parse(localStorage.getItem('projects'));
    if (!projects) {
        projects = [];
    }
    return projects;
};
function saveProjects (projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
};
function newTaskListItem(taskName, listType) {
    let li = document.createElement('li');
    li.type = 'text';
    li.className = 'task_list_item';
    li.textContent = taskName;
    li.draggable = true;
    li.addEventListener('dragstart', function(e) {
        e.dataTransfer.setData('text/plain', taskName);
        e.dataTransfer.setData('listType', listType);
    });

    let img = document.createElement('img');
    img.src = 'icons/garbage.png';
    img.alt = 'garbage';
    img.className = 'delete_icon';
    img.dataset.listType = listType;
    img.addEventListener('click', function() {
        li.remove();
        removeTask(taskName, listType);
    });
    li.appendChild(img);
    return li;
}
 
document.getElementById('addTask').onclick = function() {
    let taskName =document.getElementById('input_task_name').value;
    if (!taskName) {
        alert('Please enter a task name.');
        return;
    }
    let newListItem = newTaskListItem(taskName, 'todo');
    let todoList =  document.getElementById('todoList');
    todoList.appendChild(newListItem);
    project.todoList.push(taskName);
    saveProjects(projects);
    document.getElementById('input_task_name').value = '';
}

document.getElementById('btnDeleteProject').onclick = function() {
    if (!projectName) {
        alert('No project selected.');
        return;
    }
    console.log(`Deleting project: ${projectName}`);
    // Uncomment the following lines to enable confirmation dialog
    if (confirm(`Are you sure you want to delete the project "${projectName}"?`)) {
        let projects = loadProjects();
        projects = projects.filter(project => project.name !== projectName);
        saveProjects(projects);
        window.location.href = 'projects.html';
    }
}

document.getElementById('btnDeleteTask').onclick = function(taskName) {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    if (project) {
        project.todoList = project.todoList.filter(task => task.textContent !== taskName);
        saveProjects(projects);
    }
};

