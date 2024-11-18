const express = require("express");
const router = express.Router();

const { createComment } = require("../controllers/commentController");

// Route to create a new comment
router.post("/comment", createComment);

// Route to get all comments for a specific post
// router.get("/:postId", getComments);

// Temporary route for testing purposes
router.get("/", (req, res) => {
  res.send("Welcome to the Comments API!");
});

module.exports = router;
