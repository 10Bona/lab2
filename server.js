const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

// Database connection
mongoose.connect(
  "mongodb+srv://bonageleta:cXnenoIiAALSxLM4@cluster0.8csting.mongodb.net/lab2?retryWrites=true&w=majority&appName=Cluster0"
);

// Define schemas and models
const employeeSchema = new mongoose.Schema({
  employee_id: { type: String, unique: true },
  full_name: String,
  email: String,
  hashed_password: String,
});

const projectSchema = new mongoose.Schema({
  project_code: { type: String, unique: true },
  project_name: String,
  project_description: String,
});

const projectAssignmentSchema = new mongoose.Schema({
  employee_id: String,
  project_code: String,
  start_date: Date,
});

const Employee = mongoose.model("Employee", employeeSchema);
const Project = mongoose.model("Project", projectSchema);
const ProjectAssignment = mongoose.model(
  "ProjectAssignment",
  projectAssignmentSchema
);

// API endpoints / routes
app.post("/api/employees", async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).send(employee);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/api/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    await project.save();
    res.status(201).send(project);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.post("/api/project_assignments", async (req, res) => {
  try {
    const projectAssignment = new ProjectAssignment(req.body);
    await projectAssignment.save();
    res.status(201).send(projectAssignment);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.get("/api/project_assignments", async (req, res) => {
  try {
    const assignments = await ProjectAssignment.find()
      .limit(5)
      .sort({ start_date: -1 });

    const detailedAssignments = await Promise.all(
      assignments.map(async (assignment) => {
        const employee = await Employee.findOne({
          employee_id: assignment.employee_id,
        }).select("full_name");
        const project = await Project.findOne({
          project_code: assignment.project_code,
        }).select("project_name");

        return {
          ...assignment.toObject(),
          employee_name: employee ? employee.full_name : "Unknown",
          project_name: project ? project.project_name : "Unknown",
        };
      })
    );

    res.status(200).send(detailedAssignments);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
