const mongoose = require("mongoose");

// Like Model
const likeSchema = mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post", //ye post model ko refer kar raha hai
  }, 
  user: {
    type: String,
    required: true,
  },
});

// Export the model
module.exports = mongoose.model("Like", likeSchema);
