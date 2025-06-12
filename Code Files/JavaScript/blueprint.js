const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');
document.getElementById('project_name').textContent = ` ${projectName} - Kanban Board`;


window.onload = function() {
    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        const listElem = document.getElementById(listId);

        listElem.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        listElem.addEventListener('drop', function(e) {
            e.preventDefault();
            const taskName = e.dataTransfer.getData('text/plain');
            const sourceList = e.dataTransfer.getData('sourceList');
            const targetList = listId;
            const listItemId = e.dataTransfer.getData('listItem');

            if (sourceList !== targetList && taskName && sourceList) {
                console.log(`Moving task: ${taskName} from ${sourceList} to ${targetList}`);
                removeTask(taskName, listItemId, sourceList);
                addTaskToList(taskName, targetList);
            } 
        });
    });

    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);

    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        project[listId].forEach(task => {
            let li = newTaskListItem(task, listId);
            document.getElementById(listId).appendChild(li);
        });
    });
}

function removeTask(taskName, listItemId, listId) {
    console.log(`Removing task: ${taskName}  with id ${listItemId} from list: ${listId}`);

    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    project[listId].splice(project[listId].indexOf(taskName), 1);
    saveProjects(projects);
    console.log(`Task removed from storage: ${taskName}`);

    let listElement = document.getElementById(listId);
    let li = document.getElementById(listItemId);
    listElement.removeChild(li);
    console.log(`Task remove from DOM`, listItemId);
}

function newTaskListItem(taskName, listId) {
    let li = document.createElement('li');
    li.type = 'text';
    li.className = 'task_list_item';
    li.textContent = taskName;
    li.draggable = true; 
    li.id = `${taskName}-${listId}`; 

    // Add dragstart event listener to the list item
    li.addEventListener('dragstart', function (e) {
        console.log(`[dragstart] task: ${taskName}, from list: ${listId}`);
        e.dataTransfer.setData('text/plain', taskName);
        e.dataTransfer.setData('sourceList', listId);
        e.dataTransfer.setData('listItem', li.id);
    });

    let img = document.createElement('img');

    // check if dark mode is enabled
    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        img.src = 'icons/blackGarbage.png'; 
    } else {
        img.src = 'icons/garbage.png'; 
    } 
    img.alt = 'garbage';
    img.className = 'delete_icon';
    img.addEventListener('click', function() {
        removeTask(taskName, li.id, li.parentElement.id);
    });
    
    let btn = document.createElement('button');
    btn.textContent = 'Edit';
    btn.id = 'edit_button';
    btn.onclick = function() {
        let newTaskName = prompt('Edit task name:', taskName);
        if (newTaskName !== taskName) {
            removeTask(taskName, li.id, listId);
            addTaskToList(newTaskName, listId);
        }
    };

    li.appendChild(btn);
    li.appendChild(img);
    return li;
}
 
// Function to add a task to the specified list, both to the project data and the DOM
function addTaskToList(taskName, listId) {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);

    project[listId].push(taskName);
    saveProjects(projects);

    let listElement = document.getElementById(listId);
    let li = newTaskListItem(taskName, listId);
    listElement.appendChild(li);
}

document.getElementById('addTask').onclick = function() {
    let taskName =document.getElementById('input_task_name').value;
    if (!taskName) {
        alert('Please enter a task name.');
        return;
    }
    document.getElementById('input_task_name').value = '';
    addTaskToList(taskName, 'todoList'); 
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

