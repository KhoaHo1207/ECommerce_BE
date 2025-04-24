const express = require("express");
const router = express.Router();
const Ctrls = require("../controllers/blogCategory");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
router.get("/", Ctrls.getBlogCategories);
router.get("/:bcid", Ctrls.getBlogCategory);
router.post("/", [verifyAccessToken, isAdmin], Ctrls.createBlogCategory);
router.put("/:bcid", [verifyAccessToken, isAdmin], Ctrls.updateBlogCategory);
router.delete("/:bcid", [verifyAccessToken, isAdmin], Ctrls.deleteBlogCategory);

module.exports = router;
