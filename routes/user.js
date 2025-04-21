const router = require("express").Router();
const { register } = require("../controllers/user");
router.post("/register", register);
module.exports = router;
