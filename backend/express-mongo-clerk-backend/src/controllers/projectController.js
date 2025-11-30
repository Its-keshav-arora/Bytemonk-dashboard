const Project = require("../models/Project");

// Create project
exports.createProject = async (req, res) => {
  try {
    const userId = req.userId || req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, description } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const project = new Project({
      title,
      description,
      ownerId: userId,
    });

    await project.save();
    res.status(201).json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all projects
exports.getProjects = async (req, res) => {
  try {
    const userId = req.userId || req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    
    const projects = await Project.find({ ownerId: userId }).sort({
      createdAt: -1,
    });

    res.json(projects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const userId = req.userId || req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Not found" });
    if (project.ownerId !== userId)
      return res.status(403).json({ message: "Forbidden" });

    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update
exports.updateProject = async (req, res) => {
  try {
    const userId = req.userId || req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Not found" });
    if (project.ownerId !== userId)
      return res.status(403).json({ message: "Forbidden" });

    const { title, description } = req.body;
    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;

    await project.save();
    res.json(project);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete
exports.deleteProject = async (req, res) => {
  try {
    const userId = req.userId || req.auth?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    
    const project = await Project.findById(req.params.id);

    if (!project) return res.status(404).json({ message: "Not found" });
    if (project.ownerId !== userId)
      return res.status(403).json({ message: "Forbidden" });

    await project.deleteOne();
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
