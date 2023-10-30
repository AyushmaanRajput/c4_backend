const express = require("express");
const router = express.Router();
const postController = require("../controllers/post.controller");
const { auth } = require("../middlewares/auth.middleware");

router.use(auth);

router.post("/add", postController.addPost);

router.get("/", postController.getPosts);

router.get("/top", postController.getTopPosts);

router.patch("/update/:id", postController.updatePost);

router.delete("/delete/:id", postController.deletePost);

module.exports = router;
