const express = require("express");

const server = express();

server.use(express.json());
server.listen(3000);

const projects = [];
let countReq = 0;

/**
 * Middleware to check exists project id
 * @param {request} req
 * @param {response} res
 * @param {next call} next
 */
function midExistsProject(req, res, next) {
  const { id } = req.params;
  const project = getProjectById(id);
  if (!project) {
    return res.status(401).json({ erroe: "Project not found" });
  }

  req.project = project;

  return next();
}

/**
 * Meddleware to Log requests
 * @param {request} req
 * @param {response} res
 * @param {next} next
 */
function midLogRequests(req, res, next) {
  countReq++;
  console.log(`Número de requiçoes ${countReq}`);
  return next();
}

server.use(midLogRequests);

function getProjectById(id) {
  let project = projects.find(pr => {
    return pr.id === id;
  });
  return project;
}

function updateProject(project) {
  projects.forEach((element, index) => {
    if (element.id == project.id) {
      projects[index] = project;
    }
  });
}

function deleteProject(project) {
  projects.forEach((element, index) => {
    if (element.id == project.id) {
      projects.splice(index, 1);
    }
  });
}

function addTask(project, task) {
  project.tasks.push(task);
}

/**
 * Create a project
 * Method POST
 * body {
 *  id: "1234"
 *  title: "name project"
 * }
 */
server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const tasks = [];
  projects.push({ id, title, tasks });

  return res.send();
});

/**
 * Update projects
 * Method PUT
 * paramsRoute [
 *  id
 * ]
 * body {
 *  title: "name task"
 * }
 */
server.put("/projects/:id", midExistsProject, (req, res) => {
  const { title } = req.body;
  const { project } = req;
  project.title = title;

  updateProject(project);

  return res.send();
});

/**
 * Delete projects
 * Method DELETE
 */
server.delete("/projects/:id", midExistsProject, (req, res) => {
  const { project } = req;
  deleteProject(project);

  return res.send();
});

/**
 * Add task in project
 * Method GET
 */
server.get("/projects", (req, res) => {
  res.json(projects);
});

/**
 * Add task in project
 * Method POST
 * body {
 *  task: "name task"
 * }
 */
server.post("/projects/:id/tasks", midExistsProject, (req, res) => {
  const { task } = req.body;
  const { project } = req;
  addTask(project, task);

  return res.send();
});
