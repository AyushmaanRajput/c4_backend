const { Post } = require("../models/Post.model");
const { User } = require("../models/User.model");
require("dotenv").config();

exports.addPost = async (req, res, next) => {
  const newPost = new Post({ ...req.body, userId: req.body.userId });
  try {
    newPost.save();
    res.status(200).json({ msg: "New Post created", post: newPost });
  } catch (e) {
    res.status(500).json({ msg: "Couldn't create Post", error: e });
  }
};

exports.getPosts = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const userId = req.body.userId;
  try {
    console.log(page, limit, userId);
    if (page && limit) {
      const posts = await Post.find({ userId: userId })
        .limit(limit * 1)
        .skip((page - 1) * limit);
      console.log(posts);
      // const count = await posts.countDocuments({ userId: userId });
      const total = await Post.find({ userId: userId });

      console.log(total.length);
      return res.status(200).json({
        msg: "Posts found",
        posts: posts,
        totalPages: Math.ceil(total.length / limit),
      });
    } else {
      const posts = await Post.find({ userId: userId });
      return res.status(200).json({ msg: "Posts found", posts: posts });
    }
  } catch (err) {
    res.status(500).json({ msg: "Couldn't fetch posts", error: err });
  }
};
exports.getTopPosts = async (req, res, next) => {
  const page = req.query.page;
  const limit = req.query.limit;
  const userId = req.body.userId;
  console.log(page, limit, userId);
  try {
    const posts = await Post.find({ userId: userId })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ no_of_comments: -1 });
    console.log(posts);
    // const count = await posts.countDocuments({ userId: userId });
    const total = await Post.find({ userId: userId });

    console.log(total.length);
    return res.status(200).json({
      msg: "Top Posts found",
      posts: posts,
      totalPages: Math.ceil(total.length / limit),
    });
  } catch (err) {
    res.status(500).json({ msg: "Couldn't fetch posts", error: e });
  }
};

exports.updatePost = async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findOne({ _id: req.body.userId });
  if (user._id == req.body.userId) {
    const newPost = await Post.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json({ msg: "Post upated successfully", updatedPost: newPost });
  } else {
    res.status(400).json({ msg: "Unauthorized, cannot update post" });
  }
};

exports.deletePost = async (req, res, next) => {
    const id = req.params.id;
  const user = await User.findOne({ _id: req.body.userId });
  if (user._id == req.body.userId) {
    const post = await Post.findByIdAndDelete(id, req.body);
    res.status(200).json({ msg: "Post Deleted successfully", deletedPost: post });
  } else {
    res.status(400).json({ msg: "Unauthorized, cannot update post" });
  }
};
