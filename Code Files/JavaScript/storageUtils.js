function loadProjects () {
    return  JSON.parse(localStorage.getItem('projects')) || [];
};
function saveProjects (projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
};
function loadUsers () {
    return JSON.parse(localStorage.getItem('users')) || [];
};
function saveUsers (users) {
    localStorage.setItem('users', JSON.stringify(users));
};