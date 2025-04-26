const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
const Ctrls = require("../controllers/order");
router.post("/", verifyAccessToken, Ctrls.createOrder);
// router.get("/", [verifyAccessToken, isAdmin], Ctrls.getOrders);
// router.get("/:oid", [verifyAccessToken, isAdmin], Ctrls.getOrder);
// router.put("/:oid", [verifyAccessToken, isAdmin], Ctrls.updateOrder);
// router.delete("/:oid", [verifyAccessToken, isAdmin], Ctrls.deleteOrder);

module.exports = router;
