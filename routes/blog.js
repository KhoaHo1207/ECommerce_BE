const express = require("express");
const router = express.Router();
const Ctrls = require("../controllers/blog");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
router.post("/", [verifyAccessToken, isAdmin], Ctrls.createBlog);
router.get("/", Ctrls.getBlogs);
router.get("/:bid", Ctrls.getBlog);
router.put("/:bid", [verifyAccessToken, isAdmin], Ctrls.updateBlog);
router.delete("/:bid", [verifyAccessToken, isAdmin], Ctrls.deleteBlog);
// router.put("/like/:bid", verifyAccessToken, Ctrls.likeBlog);
// router.put("/dislike/:bid", verifyAccessToken, Ctrls.dislikeBlog);
router.put("/react/:bid", verifyAccessToken, Ctrls.reactToBlog);

module.exports = router;
