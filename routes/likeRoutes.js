// routes/likeRoutes.js
const express = require("express");
const { createLike, createUnlike } = require("../controllers/likeController");
const router = express.Router();

router.post("/like", createLike);
router.post("/unlike", createUnlike);
// router.get("/like/:postId", getLikes);

module.exports = router;
