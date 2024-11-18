const Post = require("../models/postModel");

// Create a new post
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;

    // Validate required fields
    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    // Create and save the new post
    const newPost = new Post({ title, content });
    const savePost = await newPost.save();

    // Send a success response with the newly created post
    res.status(201).json({
      post: savePost,
      message: "Post created successfully",
    });
  } catch (err) {
    // Handle any unexpected errors
    console.error("Error creating post:", err);
    res.status(500).json({
      message: "An error occurred while creating the post",
      error: err.message,
    });
  }
};

// Get all posts
const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("comments")
      .populate("likes")
      .exec();

    res.status(200).json(posts);
  } catch (err) {
    console.error("Error getting posts:", err);
    res.status(500).json({
      message: "An error occurred while getting the posts",
      error: err.message,
    });
  }
};

// // Get a single post
// const getPost = async (req, res) => {};

//Export all Constrollers

module.exports = { createPost, getPosts };
