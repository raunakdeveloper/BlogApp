const express = require("express");
const { createPost, getPosts } = require("../controllers/postController");
const router = express.Router();

router.post("/create", createPost);
router.get("/", getPosts);
// router.get('/:id', getPost);

module.exports = router;
