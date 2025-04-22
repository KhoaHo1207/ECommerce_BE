const router = require("express").Router();
const Ctrls = require("../controllers/user");
const { verifyAccessToken } = require("../middlewares/verifyToken");
router.post("/register", Ctrls.register);
router.post("/login", Ctrls.login);
router.get("/current", verifyAccessToken, Ctrls.getCurrentUser);
module.exports = router;
