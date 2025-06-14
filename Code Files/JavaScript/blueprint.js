const urlParams = new URLSearchParams(window.location.search);
const projectName = urlParams.get('project');
document.getElementById('project_name').textContent = ` ${projectName} - Kanban Board`;
var projects = loadProjects();
var project = projects.find(p => p.name === projectName);


window.onload = function() {
    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        const listElem = document.getElementById(listId);

        listElem.addEventListener('dragover', function(e) {
            e.preventDefault();
        });

        listElem.addEventListener('drop', function(e) {
            e.preventDefault();
            const taskName = e.dataTransfer.getData('text/plain');
            const taskDescription = e.dataTransfer.getData('taskDescription');
            const assignedUsers = e.dataTransfer.getData('assignedUsers') ? JSON.parse(e.dataTransfer.getData('assignedUsers')) : [];
            const sourceList = e.dataTransfer.getData('sourceList');
            const targetList = listId;
            const listItemId = e.dataTransfer.getData('listItem');

            if (sourceList !== targetList && taskName && sourceList) {
                //console.log(`Moving task: ${taskName} from ${sourceList} to ${targetList}`);
                addTaskToList(taskName, taskDescription, assignedUsers, targetList);
                removeTask(taskName, listItemId, sourceList);
                updateTaskCounters();
            }
        });
    });

    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        project[listId].forEach(task => {
            let li = newTaskListItem(task, listId);
            document.getElementById(listId).appendChild(li);
        });
    });
    updateTaskCounters();

    fillUsersCheckboxes();
    loadFilterUsers();
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
    if( assignedUsers.length === 0) {
        alert('Please assign at least one user to the task.');
        return;
    }
    addTaskToList(taskName, taskDescription, assignedUsers, 'todoList');
    document.getElementById('input_task_name').value = '';
    document.getElementById('input_task_description').value = '';
    document.querySelectorAll('.user_checkbox').forEach(cb => cb.checked = false); // Uncheck all user checkboxes
    updateTaskCounters();
}

// Function to add a task to the specified list, both to the project data and the DOM
function addTaskToList(taskName, taskDescription, assignedUsers, listId) {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    let task = {
        name: taskName,
        description: taskDescription,
        assignedTo: assignedUsers
    };

    project[listId].push(task);
    saveProjects(projects);

    let listElement = document.getElementById(listId);
    let li = newTaskListItem(task, listId);
    listElement.appendChild(li);
    //filterTasks() 
}

function newTaskListItem(task, listId) {
    let li = newLI(task, listId);

    let nameDiv = document.createElement('div');
    nameDiv.className = 'task_name_div';
    nameDiv.innerHTML = `<b>Task Name:</b> ${task.name}`;
    li.appendChild(nameDiv);

    let descriptionDiv = document.createElement('div');
    descriptionDiv.className = 'task_description_div';
    descriptionDiv.innerHTML = `<b>Description:</b> ${task.description || 'No description provided'}`;
    li.appendChild(descriptionDiv);

    let assignedUsers = task.assignedTo || [];
    if (assignedUsers.length > 0) {
        let assignedDiv = document.createElement('div');
        assignedDiv.innerHTML = `<b>Assigned to:</b> ${assignedUsers.join(', ')}`;
        li.appendChild(assignedDiv);
    }

    let deleteImage = newDeletebtn(task.name, li);
    let editImage = newEditBtn(task, li, listId);
    let iconsDiv = document.createElement('div');
    iconsDiv.className = 'task_icons_div';
    iconsDiv.appendChild(editImage);
    iconsDiv.appendChild(deleteImage);
    li.appendChild(iconsDiv);

    const isDarkMode = document.body.classList.contains('dark-mode');
    addIcons(deleteImage, editImage, isDarkMode);
    return li;
}

function newDeletebtn(taskName, li) {
    let btn = document.createElement('img');
    btn.alt = 'garbage';
    btn.className = 'delete_icon';
    btn.addEventListener('click', function() {
        removeTask(taskName, li.id, li.parentElement.id);
    });
    return btn;
}
function newEditBtn(task, li, listId) {
    let editImage = document.createElement('img');

    editImage.alt = 'edit';
    editImage.className = 'edit_icon';
    editImage.addEventListener('click', function() {
        const modal = document.getElementById('edit-task-modal');
        const titleInput = document.getElementById('edit-task-title');
        const descriptionInput = document.getElementById('edit-task-description');
        // load users checkboxes
        fillEditTaskUsers(task.assignedTo);
        // check already assigned users
        const userCheckboxes = document.querySelectorAll('#edit-task-users');

        userCheckboxes.forEach(checkbox => {
            checkbox.checked = task.assignedTo.includes(checkbox.value);
        });
        // Set current values
        titleInput.value = task.name;
        descriptionInput.value = task.description;

        // Show modal
        modal.style.display = 'block';
        
        // Close button functionality
        document.querySelector('.close').onclick = function() {
            modal.style.display = 'none';
            titleInput.value = '';
            descriptionInput.value = '';
            document.querySelectorAll('.user-checkbox').forEach(cb => cb.checked = false); // Uncheck all user checkboxes
        }
        

        // Save changes
        document.getElementById('save-edit-task').onclick = function() {
            const newName = titleInput.value.trim();
            const newDescription = descriptionInput.value.trim();
            const newAssignedUsers = Array.from(document.querySelectorAll('.edit_user_checkbox:checked'))
                .map(cb => cb.value);
            
            if (!newName) {
                alert('Task name cannot be empty');
                return;
            }
            
            if (newName !== task.name || newDescription !== task.description ||
                JSON.stringify(newAssignedUsers) !== JSON.stringify(task.assignedTo)) {
                removeTask(task.name, li.id, listId);
                addTaskToList(newName, newDescription, newAssignedUsers, listId);
            }
            
            modal.style.display = 'none';
            // Clear the input fields
            titleInput.value = '';
            descriptionInput.value = '';
            document.getElementById('edit-task-users').innerHTML = ''; // Clear the user checkboxes
            updateTaskCounters();
            console.log(`Task "${task.name}" edited to "${newName}" in list "${listId}"`);
            //filterTasks();
        }

    });
    return editImage;
}

function newLI(task, listId){
    let li = document.createElement('li');
    let taskName = task.name; // Assuming task is an object with a 'name' property
    li.className = 'task_list_item';
    li.draggable = true; 
    li.id = `${taskName}-${listId}`; 
    
    // Add dragstart event listener to the list item
    li.addEventListener('dragstart', function (e) {
        console.log(`[dragstart] task: ${taskName}, from list: ${listId}`);
        e.dataTransfer.setData('text/plain', taskName);
        e.dataTransfer.setData('taskDescription', task.description || '');
        e.dataTransfer.setData('assignedUsers', JSON.stringify(task.assignedTo || []));
        e.dataTransfer.setData('sourceList', listId);
        e.dataTransfer.setData('listItem', li.id);
    });
    return li;
}
function addIcons(deleteImage, editImage, isDarkMode) {
    deleteImage.src = isDarkMode ? '../../icons/blackGarbage.png' : '../../icons/garbage.png';
    editImage.src = isDarkMode ? '../../icons/blackEdit.png' : '../../icons/whiteEdit.png';
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

function fillEditTaskUsers(assignedUsers) {
    let users = loadUsers();
    let userContainer = document.getElementById('edit-task-users');

    users.forEach(user => {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `edit_user_${user.name}`;
        checkbox.value = user.name;
        checkbox.className = 'edit_user_checkbox';
        checkbox.checked = assignedUsers.includes(user.name); // Check if user is already assigned
        let label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = user.name;
        label.appendChild(checkbox);
        userContainer.appendChild(label);
    });
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
document.getElementById('btnSelectAll').onclick = function() {
    const checkboxes = document.querySelectorAll('.user_checkbox');
    const anyUnchecked = Array.from(checkboxes).some(cb => !cb.checked);
    
    checkboxes.forEach(checkbox => {
        checkbox.checked = anyUnchecked;
    });
};

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
    //filterTasks();
}
