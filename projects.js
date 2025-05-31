
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
        let project = {
            name: projectName,
            todoList: [],
            inProgressList: [],
            doneList: []
        }
        let projects = loadProjects();
        projects.push(project);
        saveProjects(projects);
        let li = newProjectListItem(projectName);
        document.getElementById('projectList').appendChild(li);
        document.getElementById('input_project_name').value = '';
    };
    loadProjects = function() {
        let projects = JSON.parse(localStorage.getItem('projects') || '[]');
        return projects;
    };
    saveProjects = function(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
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