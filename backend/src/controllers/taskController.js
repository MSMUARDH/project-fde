const Task = require("../models/Task");

//!  Create a task
exports.createTask = async (req, res) => {
  try {
    const { taskName, description, startDate, endDate, assignedTo, isEnabled } =
      req.body;
    const task = new Task({
      taskName,
      description,
      startDate,
      endDate,
      assignedTo,
      isEnabled,
    });

    await task.save();
    res.status(201).json({ task: task });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//! Update task details
exports.updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    const { taskName, description, startDate, endDate, assignedTo, isEnabled } =
      req.body;

    console.log(
      "taskName, description, startDate, endDate, assignedTo, isEnabled",
      taskName,
      description,
      startDate,
      endDate,
      assignedTo,
      isEnabled
    );

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      { taskName, description, startDate, endDate, assignedTo, isEnabled },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    console.log("UPDATED", updatedTask);

    res.status(200).json({ task: updatedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//! Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTask = await Task.findByIdAndDelete(id);


    console.log("deletedTask", deletedTask);
    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
      task: deletedTask,
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//! Retrieve tasks with filters
exports.getTasks = async (req, res) => {
  try {
    const filters = req.query;
    const tasks = await Task.find(filters).populate("assignedTo");
    res.status(200).json({ tasks: tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//! Retrieve tasks for specific user
exports.getUserTasks = async (req, res) => {
  try {
    const { userId } = req.body;
    // Fetch all tasks where assignedTo matches the userId
    const tasks = await Task.find({ assignedTo: userId, isEnabled: true });

    // If no tasks are found, return a 404 status
    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this user." });
    }

    // Return the tasks as a response
    res.status(200).json({ tasks: tasks });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//! get single task
exports.getSingeTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // if (userRole != "admin") {
    //   return res.status(404).json({
    //     success: false,
    //     message: "You are not autorized",
    //   });
    // }
    const task = await Task.findById(taskId); // Exclude passwords from response

    return res.status(200).json({
      success: true,
      message: "Task fetched successfully",
      task,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: err.message,
    });
  }
};

//! Update task completion
exports.updateTaskCompletion = async (req, res) => {
  try {
    const { id } = req.params;
    const { isCompleted, completionDate } = req.body;

    // if (!isCompleted && completionDate) {
    //   res.status(400).json({ error: "Task should be completed to update completion date" });
    // }

    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { isCompleted, completionDate },
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ task: updatedTask });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// !get a single task
exports.getTaskDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
