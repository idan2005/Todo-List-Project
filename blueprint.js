const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');
document.getElementById('project_name').textContent = ` ${projectName} - Kanban Board`;

 
window.onload = function() {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);

    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        const listElem = document.getElementById(listId);

        listElem.addEventListener('dragover', function(e) {
            e.preventDefault();
            console.log(`[dragover] on list: ${listId}`);
        });

        listElem.addEventListener('drop', function(e) {
            e.preventDefault();
            const taskName = e.dataTransfer.getData('text/plain');
            const sourceList = e.dataTransfer.getData('sourceList');
            const targetList = listId;
            const listItem = e.dataTransfer.getData('listItem');
            console.log(`[drop] taskName:`, taskName);
            console.log(`[drop] sourceList:`, sourceList);
            console.log(`[drop] targetList:`, targetList);
            console.log(`[drop] listItem:`, listItem);
            if (!taskName) {
                console.warn(`[drop] No taskName found in dataTransfer`);
            }
            if (!sourceList) {
                console.warn(`[drop] No sourceList found in dataTransfer`);
            }

            if (sourceList !== targetList && taskName && sourceList) {
                console.log(`Moving task: ${taskName} from ${sourceList} to ${targetList}`);
                removeTask(taskName, listItem, sourceList);
                addTaskToList(taskName, targetList);
            } else {
                console.log(`[drop] Not moving: sourceList === targetList or missing data`);
            }
        });
    });

    // Render existing tasks
    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        project[listId].forEach(task => {
            let li = newTaskListItem(task, listId);
            document.getElementById(listId).appendChild(li);
        });
    });
}

function newTaskListItem(taskName, listId) {
    let li = document.createElement('li');
    li.type = 'text';
    li.className = 'task_list_item';
    li.textContent = taskName;
    li.draggable = true; // Make draggable

    // Drag events
    li.addEventListener('dragstart', function (e) {
        console.log(`[dragstart] task: ${taskName}, from list: ${listId}`);
        e.dataTransfer.setData('text/plain', taskName);
        e.dataTransfer.setData('sourceList', listId);
        e.dataTransfer.setData('listItem', this);
    });
    let img = document.createElement('img');
    img.src = 'icons/garbage.png';
    img.alt = 'garbage';
    img.className = 'delete_icon';
    img.addEventListener('click', function() {
        removeTask(taskName, li, li.parentElement.id);
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
    document.getElementById('input_task_name').value = '';
    addTaskToList(taskName, 'todoList'); // Default to "In Progress" list
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

function removeTask(taskName, listItem, listId) {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    console.log(`Removing task: ${taskName} from list: ${listId}`);
    project[listId].splice(project[listId].indexOf(taskName), 1);
    saveProjects(projects);
    console.log(`Task removed: ${taskName}`);

    //listItem.remove();
}
