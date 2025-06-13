isDarkMode = localStorage.getItem('isDarkMode') === 'true';
window.onload = function() {
    let users = loadUsers();
    let userList = document.getElementById('userList');
    users.forEach(user => {
        let li = newUserListItem(user.name);
        userList.appendChild(li);
    });
};
document.getElementById('addUser').onclick = function() {
        const userName = document.getElementById('input_user_name').value;
        if (!userName) {
            alert('Please enter a user name.');
            return;
        }
        let users = loadUsers();
        if (users.find(u => u.name === userName)) {
            alert('User already exists.');
            return;
        }
        let user = {
            name: userName
        };
        users.push(user);
        saveUsers(users);
        let li = newUserListItem(userName);
        document.getElementById('userList').appendChild(li);
        document.getElementById('input_user_name').value = '';
    };
function newUserListItem (userName) {
    let li = document.createElement('li');
    li.className = 'user_list_item';
    li.textContent = userName
    li.id = userName;

    let deleteImage = document.createElement('img');

    deleteImage.alt = 'garbage';
    deleteImage.className = 'delete_icon';
    deleteImage.addEventListener('click', function() {
        removeUser(userName);
    });

    const isDarkMode = document.body.classList.contains('dark-mode');
    if (isDarkMode) {
        deleteImage.src = '../../icons/blackGarbage.png'; 
    } else {
        deleteImage.src = '../../icons/garbage.png'; 
    } 
    
    li.appendChild(deleteImage);
    return li;
}

function removeUser(userName) {
    let users = loadUsers();
    let userIndex = users.findIndex(u => u.name === userName);
    if (userIndex === -1) {
        alert('User not found.');
        return;
    }   
    users.splice(userIndex, 1);
    saveUsers(users);
    let userListElement = document.getElementById('userList');
    let li = document.getElementById(userName);
    userListElement.removeChild(li);
}

