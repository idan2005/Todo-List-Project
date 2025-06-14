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
                //console.log(`Moving task: ${taskName} from ${sourceList} to ${targetList}`);
                addTaskToList(taskName, targetList);
                removeTask(taskName, listItemId, sourceList);
                updateTaskCounters();
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
    updateTaskCounters();

    fillUsersCheckboxes();
}
function updateTaskCounters() {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);

    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        let listTitle = document.getElementById(`${listId}Title`);
        let taskCount = project[listId].length;
        let listName = listId.charAt(0).toUpperCase() + listId.slice(1, -4); // get the list name without 'List'
        listTitle.textContent = `${listName} (${taskCount})`;
    });
}

function removeTask(taskName, listItemId, listId) {
    //console.log(`Removing task: ${taskName}  with id ${listItemId} from list: ${listId}`);

    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    project[listId].splice(project[listId].indexOf(taskName), 1);
    saveProjects(projects);
    //console.log(`Task removed from storage: ${taskName}`);

    let listElement = document.getElementById(listId);
    let li = document.getElementById(listItemId);
    listElement.removeChild(li);
    //console.log(`Task remove from DOM`, listItemId);

    updateTaskCounters();
}

function newTaskListItem(task, listId) {
    let li = newLI(task, listId);
    let deleteImage = newDeletebtn();
    let editImage = newEditBtn();
    const isDarkMode = document.body.classList.contains('dark-mode');
    addIcons(deleteImage, editImage, isDarkMode);

    li.appendChild(editImage);
    li.appendChild(deleteImage);
    return li;
}
function newLI(task, listId){
    let li = document.createElement('li');
    let taskName = task.name; // Assuming task is an object with a 'name' property
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
    return li;
}
function newDeletebtn(){
    let btn = document.createElement('img');
    btn.alt = 'garbage';
    btn.className = 'delete_icon';
    btn.addEventListener('click', function() {
        removeTask(taskName, li.id, li.parentElement.id);
    });
    return btn;
}
function newEditBtn(){
    let editImage = document.createElement('img');

    editImage.alt = 'edit';
    editImage.className = 'edit_icon';
    editImage.addEventListener('click', function() {
        let newTaskName = prompt('Edit task name:', taskName);
        if (!newTaskName) {
            alert('Task name cannot be empty.');
            return;
        }
        if (newTaskName !== taskName) {
            removeTask(taskName, li.id, listId);
            addTaskToList(newTaskName, listId);
        }
    });
    return editImage;
}
function addIcons(deleteImage, editImage, isDarkMode) {
    deleteImage.src = isDarkMode ? '../../icons/blackGarbage.png' : '../../icons/garbage.png';
    editImage.src = isDarkMode ? '../../icons/blackEdit.png' : '../../icons/whiteEdit.png';
}
// Function to add a task to the specified list, both to the project data and the DOM
function addTaskToList(taskName, listId) {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    let task = {
        name: taskName,
        description: null,
        assignedTo: null
    };

    project[listId].push(task);
    saveProjects(projects);

    let listElement = document.getElementById(listId);
    let li = newTaskListItem(task, listId);
    listElement.appendChild(li);
}

document.getElementById('addTask').onclick = function() {
    let taskName =document.getElementById('input_task_name').value;
    let taskDescription = document.getElementById('input_task_description').value;
    let assignedUsers = Array.from(document.querySelectorAll('.user_checkbox:checked')).map(cb => cb.value);
    if (!taskDescription) {
        taskDescription = null; 
    }
    if (!taskName) {
        alert('Please enter a task name.');
        return;
    }
    document.getElementById('input_task_name').value = '';
    document.getElementById('input_task_description').value = '';
    
    addTaskToList(taskName, taskDescription, 'todoList'); 
    updateTaskCounters();
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

function fillUsersCheckboxes() {
    let users = loadUsers();
    let userContainer = document.getElementById('userCheckboxes');

    users.forEach(user => {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `user-${user.name}`;
        checkbox.value = user.name;
        checkbox.className = 'user_checkbox';
        let label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = user.name;
        label.appendChild(checkbox);
        userContainer.appendChild(label);
    });
}

document.getElementById('btnSelectAll').onclick = function() {
    const checkboxes = document.querySelectorAll('.user_checkbox');
    const anyUnchecked = Array.from(checkboxes).some(cb => !cb.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = anyUnchecked;
    });
};