// Example users array
const users = loadUsers();
const selectedUsersSpan = document.querySelector('.selected-users');
var userCheckboxList = document.getElementById('user-checkbox-list');
function loadFilterUsers() {
    users.forEach(user => {
        let checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `filter-user-${user.name}`;
        checkbox.value = user.name;
        checkbox.className = 'filter_user_checkbox';
        checkbox.addEventListener('change', filterTasks); // 3. Add event listener to each checkbox
        let label = document.createElement('label');
        label.htmlFor = checkbox.id;
        label.textContent = user.name;
        label.appendChild(checkbox);
        userCheckboxList.appendChild(label);
    });
}

function filterTasks() {
    console.log('Filtering tasks based on selected users...' + userCheckboxList);
    const selectedUsers = Array.from(userCheckboxList.querySelectorAll('.filter_user_checkbox'))
    .filter(cb => cb.checked)
    .map(cb => cb.value);
    console.log('Selected users:', selectedUsers);
    selectedUsersSpan.textContent = selectedUsers.length
        ? `Assigned to: ${selectedUsers.join(', ')}`
        : 'Assigned to: All';

    renderAllTaskLists(selectedUsers || []);
}


function renderAllTaskLists(selectedUsers) {
    let projects = loadProjects();
    let project = projects.find(p => p.name === projectName);
    console.log('Rendering tasks for project:', project?.name);
    ['todoList', 'inProgressList', 'doneList'].forEach(listId => {
        const ul = document.getElementById(listId);
        if (!ul) {
            console.warn(`Element with id "${listId}" not found.`);
            return;
        }
        ul.innerHTML = '';
        if (!Array.isArray(project[listId])) {
            console.warn(`No array found for project[${listId}].`);
            return;
        }
        console.log(`\nProcessing list: ${listId}`);
        console.log('Selected users:', selectedUsers);

        const filteredTasks = selectedUsers.length
            ? project[listId].filter(task =>
                Array.isArray(task.assignedTo) &&
                task.assignedTo.some(user => selectedUsers.includes(user))
            )
            : project[listId];

        console.log(`Filtered tasks for ${listId}:`, filteredTasks);

        filteredTasks.forEach(task => {
            console.log(`Adding task "${task.name}" to "${listId}"`);
            let li = newTaskListItem(task, listId);
            ul.appendChild(li);
        });
        let listTitle = document.getElementById(`${listId}Title`);
        let taskCount = filteredTasks.length;
        let listName = listId.charAt(0).toUpperCase() + listId.slice(1, -4); // get the list name without 'List'
        listTitle.textContent = `${listName} (${taskCount})`;
    });
}


document.getElementById('clear_user_btn').addEventListener('click', function() {
    resetFilter();
    filterTasks();
    updateTaskCounters();
});

function resetFilter(){
    const userCheckboxes = document.querySelectorAll('.filter_user_checkbox');
    userCheckboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
}
