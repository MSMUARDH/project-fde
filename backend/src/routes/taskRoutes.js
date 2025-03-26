const express = require("express");
const { createTask, updateTask, deleteTask, getTasks, updateTaskCompletion, getSingeTask, getUserTasks } = require("../controllers/taskController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// TODO: PUT authMiddleware for all routes

router.post("/create-task", createTask);
router.put("/update-task/:taskId", updateTask);

router.delete("/delete-task/:id", deleteTask);
router.get("/get-all-tasks", getTasks);
router.get("/get-user-task",authMiddleware, getUserTasks);
router.get("/get-task-details/:taskId", getSingeTask);


router.put("/update-task-completeion/:id", updateTaskCompletion);





module.exports = router;
