const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: String,
  body: String,
  device: String,
  no_of_comments: Number,
  userId:String
});

const Post = mongoose.model("Post", postSchema);

module.exports = { Post };
