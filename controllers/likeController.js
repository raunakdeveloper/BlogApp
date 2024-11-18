const Post = require("../models/postModel");
const Like = require("../models/likeModel");

// Function to create a like
const createLike = async (req, res) => {
  try {
    const { post, user } = req.body;

    // Validate required fields
    if (!post || !user) {
      return res.status(400).json({ message: "Post and user are required." });
    }

    // Check if user has already liked the post
    const existingLike = await Like.findOne({ post, user });
    if (existingLike) {
      return res
        .status(400)
        .json({ message: "User has already liked the post." });
    }

    // Create a new like and save it in the database
    const newLike = new Like({ post, user });
    await newLike.save();

    // Update the post to include the like
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { likes: newLike._id } }, // Assuming `likes` is the correct field
      { new: true } // Return the updated post
    ).populate("likes"); // Populate the `likes` field

    // If the post was not found
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Send a success response with the updated post
    res.status(201).json({
      post: updatedPost,
      message: "Like added successfully.",
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error creating like:", error);
    res.status(500).json({
      message: "An error occurred while creating the like.",
      error: error.message,
    });
  }
};

// Function to remove a like
const createUnlike = async (req, res) => {
  try {
    const { post, like } = req.body;

    // Validate required fields
    if (!post || !like) {
      return res
        .status(400)
        .json({ message: "Post and like ID are required." });
    }

    // Find and delete the like
    const deletedLike = await Like.findOneAndDelete({ post: post, _id: like });
    if (!deletedLike) {
      return res.status(404).json({ message: "This post is not liked." });
    }

    // Update the post to remove the like
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $pull: { likes: deletedLike._id } }, // Assuming `likes` is the correct field
      { new: true } // Return the updated post
    ).populate("likes");

    // If the post was not found
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Send a success response with the updated post
    res.status(200).json({
      post: updatedPost,
      message: "Like removed successfully.",
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error deleting like:", error);
    res.status(500).json({
      message: "An error occurred while deleting the like.",
      error: error.message,
    });
  }
};

module.exports = { createLike, createUnlike };
