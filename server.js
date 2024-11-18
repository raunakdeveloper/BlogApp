const express = require("express");
const connectDB = require("./config/mongoose"); // MongoDB connection
const commentRoutes = require("./routes/commentRoutes");
const postRoutes = require("./routes/postRoutes");
const likeRoutes = require("./routes/likeRoutes");
require("dotenv").config(); // Load environment variables

// Initialize Express app
const app = express();

// Middleware to parse JSON request bodies
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Define routes

// app.use("/api", userRoutes); // User routes
app.use("/api/posts", postRoutes); // Post routes
app.use("/api/likes", likeRoutes); // Like routes
app.use("/api/comments", commentRoutes); // Comment routes

// Test route to check if the server is working
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

// Set the port from environment variable or default to 4000
const PORT = process.env.PORT || 4000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
