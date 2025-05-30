
    document.getElementById('addProject').onclick = function() {
        const projectName = document.getElementById('input_project_name').value;
        if (!projectName) {
            alert('Please enter a project name.');
            return;
        }
        let projects = loadProjects();
        projects.push(projectName);
        saveProjects(projects);
        let li = newProjectListItem(projectName);
        document.getElementById('projectList').appendChild(li);
        document.getElementById('input_project_name').value = '';
    };
    loadProjects = function() {
        let projects = JSON.parse(localStorage.getItem('projects'));
        if (!projects) {
            projects = [];
        }
        return projects;
    };
    saveProjects = function(projects) {
        localStorage.setItem('projects', JSON.stringify(projects));
    };
    newProjectListItem = function(projectName) {
        let li = document.createElement('li');
        let btn = document.createElement('button');
        btn.textContent =  projectName
        li.id = projectName;
        li.appendChild(btn);
        return li;
    }