const express = require("express");
const router = express.Router();
const Ctrls = require("../controllers/blog");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
const uploader = require("../config/cloudinary.config");

// ================== PUBLIC ROUTES ==================

/**
 * @swagger
 * /api/v1/blog:
 *   get:
 *     summary: Lấy danh sách tất cả bài viết blog
 *     tags: [Blog]
 *     responses:
 *       200:
 *         description: Danh sách bài viết blog
 *       500:
 *         description: Lỗi server
 *     security: []
 */
router.get("/", Ctrls.getBlogs);

/**
 * @swagger
 * /api/v1/blog/{bid}:
 *   get:
 *     summary: Lấy chi tiết một bài viết blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết blog
 *     responses:
 *       200:
 *         description: Chi tiết bài viết blog
 *       404:
 *         description: Bài viết không tồn tại
 *       500:
 *         description: Lỗi server
 *     security: []
 */
router.get("/:bid", Ctrls.getBlog);

// ================== PROTECTED ROUTES (Admin only) ==================

/**
 * @swagger
 * /api/v1/blog:
 *   post:
 *     summary: Tạo một bài viết blog mới
 *     tags: [Blog]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       201:
 *         description: Bài viết blog được tạo thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.post("/", [verifyAccessToken, isAdmin], Ctrls.createBlog);

/**
 * @swagger
 * /api/v1/blog/{bid}:
 *   put:
 *     summary: Cập nhật bài viết blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết blog
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bài viết blog đã được cập nhật
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       404:
 *         description: Bài viết không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put("/:bid", [verifyAccessToken, isAdmin], Ctrls.updateBlog);

/**
 * @swagger
 * /api/v1/blog/{bid}:
 *   delete:
 *     summary: Xóa bài viết blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết blog
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bài viết blog đã được xóa
 *       404:
 *         description: Bài viết không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.delete("/:bid", [verifyAccessToken, isAdmin], Ctrls.deleteBlog);

/**
 * @swagger
 * /api/v1/blog/upload-image/{bid}:
 *   put:
 *     summary: Upload ảnh đại diện cho bài viết blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết blog
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Ảnh đại diện đã được tải lên thành công
 *       400:
 *         description: Lỗi tải ảnh lên
 *       404:
 *         description: Bài viết không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put(
  "/upload-image/:bid",
  [verifyAccessToken, isAdmin],
  uploader.single("image"),
  Ctrls.uploadImageBlog
);

// ================== PROTECTED ROUTES (User) ==================

/**
 * @swagger
 * /api/v1/blog/react/{bid}:
 *   put:
 *     summary: Người dùng thích hoặc không thích một bài viết blog
 *     tags: [Blog]
 *     parameters:
 *       - in: path
 *         name: bid
 *         required: true
 *         schema:
 *           type: string
 *         description: ID của bài viết blog
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.put("/react/:bid", verifyAccessToken, Ctrls.reactToBlog);

module.exports = router;
