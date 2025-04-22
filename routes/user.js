const router = require("express").Router();
const Ctrls = require("../controllers/user");
const { verifyAccessToken } = require("../middlewares/verifyToken");
router.post("/register", Ctrls.register);
router.post("/login", Ctrls.login);
router.get("/current", verifyAccessToken, Ctrls.getCurrentUser);
router.post("/refresh-token", Ctrls.refreshAccessToken);
router.get("/logout", Ctrls.logout);
module.exports = router;
