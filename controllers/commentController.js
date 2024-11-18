const Post = require("../models/postModel");
const Comment = require("../models/commentModel");

// Function to create a new comment
const createComment = async (req, res) => {
  try {
    const { post, user, content } = req.body;

    // Validate required fields
    if (!post || !user || !content) {
      return res
        .status(400)
        .json({ message: "Post, user, and content are required." });
    }

    // Create a new comment
    const comment = new Comment({
      post,
      user,
      content,
    });

    // Save the comment to the database
    const newComment = await comment.save();

    // Find the post by its ID and add the comment to the comments array
    const updatedPost = await Post.findByIdAndUpdate(
      post,
      { $push: { comments: newComment._id } },
      { new: true } // Return the updated post
    )
      .populate("comments") // Populate the `comments` field
      .exec();

    // If the post was not found
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Send a success response with the newly created comment
    res.status(201).json({
      post: updatedPost,
      message: "Comment created successfully.",
    });
  } catch (error) {
    // Handle any unexpected errors
    console.error("Error creating comment:", error);
    res.status(500).json({
      message: "An error occurred while creating the comment.",
      error: error.message,
    });
  }
};

module.exports = { createComment };
