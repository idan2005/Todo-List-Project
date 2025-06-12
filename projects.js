
window.onload = function() {
    let projects = loadProjects();
    let projectList = document.getElementById('projectList');
    projects.forEach(project => {
        let li = newProjectListItem(project.name);
        projectList.appendChild(li);
    });
};
document.getElementById('addProject').onclick = function() {
    const projectName = document.getElementById('input_project_name').value;
    if (!projectName) {
        alert('Please enter a project name.');
        return;
    }
    let projects = loadProjects();
    if (projects.find(p => p.name === projectName)) {
        alert('Project already exists.');
        return;
    }
    let project = {
        name: projectName,
        todoList: [],
        inProgressList: [],
        doneList: []
    }
    projects.push(project);
    saveProjects(projects);
    let li = newProjectListItem(projectName);
    document.getElementById('projectList').appendChild(li);
    document.getElementById('input_project_name').value = '';
};
newProjectListItem = function(projectName) {
    let li = document.createElement('li');
    let btn = document.createElement('button');
    btn.textContent =  projectName
    btn.onclick = function() {
        window.location.href = `blueprint.html?project=${projectName}`;
    };
    li.id = projectName;
    li.appendChild(btn);
    return li;
}