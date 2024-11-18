const mongoose = require("mongoose");

// Comment schema
const commentSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", //ye post model ko refer kar raha hai
  },
  user: {
    type: String, //
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

// Export the Comment model
module.exports = mongoose.model("Comment", commentSchema);
