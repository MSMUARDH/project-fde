require("dotenv").config();
const cors = require('cors');
const express = require("express");
const connectDB = require("./config/db");

const userRoutes = require('./routes/userRoutes')
const taskRoutes = require("./routes/taskRoutes");


const app = express();
// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow requests from this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow cookies and credentials
}));
app.use(express.json());

connectDB();



app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.listen(5000, () => console.log("Server running on port 5000"));
