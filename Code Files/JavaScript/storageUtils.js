function loadProjects () {
    return  JSON.parse(localStorage.getItem('projects')) || [];
};
function saveProjects (projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
};