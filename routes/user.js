const router = require("express").Router();
const Ctrls = require("../controllers/user");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");

// --------------------- Public Routes ---------------------

/**
 * @swagger
 * /user/register:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *     responses:
 *       201:
 *         description: Created
 *       400:
 *         description: Bad request
 */
router.post("/register", Ctrls.register);

/**
 * @swagger
 * /user/login:
 *   post:
 *     summary: Đăng nhập tài khoản
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.post("/login", Ctrls.login);

/**
 * @swagger
 * /user/refresh-token:
 *   post:
 *     summary: Lấy access token mới từ refresh token
 *     tags: [User]
 *     responses:
 *       200:
 *         description: New access token issued
 *       403:
 *         description: Forbidden
 */
router.post("/refresh-token", Ctrls.refreshAccessToken);

/**
 * @swagger
 * /user/forgot-password:
 *   get:
 *     summary: Yêu cầu reset mật khẩu
 *     tags: [User]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email để lấy mật khẩu
 *     responses:
 *       200:
 *         description: Email sent
 *       404:
 *         description: Email not found
 */
router.get("/forgot-password", Ctrls.forgotPassword);

/**
 * @swagger
 * /user/reset-password:
 *   put:
 *     summary: Đặt lại mật khẩu mới
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *               token:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid token or expired
 */
router.put("/reset-password", Ctrls.resetPassword);

// --------------------- Protected Routes ---------------------

/**
 * @swagger
 * /user/current:
 *   get:
 *     summary: Lấy thông tin user hiện tại
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       401:
 *         description: Unauthorized
 */
router.get("/current", verifyAccessToken, Ctrls.getCurrentUser);

/**
 * @swagger
 * /user/current:
 *   put:
 *     summary: Cập nhật thông tin user hiện tại
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               lastname:
 *                 type: string
 *               mobile:
 *                 type: string
 *     responses:
 *       200:
 *         description: Updated
 *       400:
 *         description: Missing fields
 */
router.put("/current", verifyAccessToken, Ctrls.updateUser);

/**
 * @swagger
 * /user/logout:
 *   get:
 *     summary: Đăng xuất tài khoản
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.get("/logout", verifyAccessToken, Ctrls.logout);

/**
 * @swagger
 * /user/address/{uid}:
 *   put:
 *     summary: Cập nhật địa chỉ người dùng
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Address updated
 *       400:
 *         description: Missing fields
 */
router.put("/address/:uid", verifyAccessToken, Ctrls.updateUserAddress);

/**
 * @swagger
 * /user/cart:
 *   put:
 *     summary: Cập nhật giỏ hàng người dùng
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.put("/cart", verifyAccessToken, Ctrls.updateCart);

// --------------------- Admin-only Routes ---------------------

/**
 * @swagger
 * /user/:
 *   get:
 *     summary: Lấy danh sách tất cả users (Admin)
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Success
 *       403:
 *         description: Forbidden
 */
router.get("/", [verifyAccessToken, isAdmin], Ctrls.getUsers);

/**
 * @swagger
 * /user/:
 *   delete:
 *     summary: Xóa user (Admin)
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID cần xóa
 *     responses:
 *       200:
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete("/", [verifyAccessToken, isAdmin], Ctrls.deleteUser);

/**
 * @swagger
 * /user/{uid}:
 *   put:
 *     summary: Admin cập nhật thông tin user
 *     tags: [User]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated
 *       400:
 *         description: Missing fields
 */
router.put("/:uid", [verifyAccessToken, isAdmin], Ctrls.updateUserByAdmin);

module.exports = router;
