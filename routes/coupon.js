const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
const Ctrls = require("../controllers/coupon");
router.post("/", [verifyAccessToken, isAdmin], Ctrls.createCoupon);
router.get("/", Ctrls.getCoupons);
router.get("/:cid", Ctrls.getCoupon);
router.put("/:cid", [verifyAccessToken, isAdmin], Ctrls.updateCoupon);
router.delete("/:cid", [verifyAccessToken, isAdmin], Ctrls.deleteCoupon);

module.exports = router;
