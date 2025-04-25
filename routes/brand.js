const express = require("express");
const router = express.Router();
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
const Ctrls = require("../controllers/brand");

router.post("/", [verifyAccessToken, isAdmin], Ctrls.createBrand);
router.get("/", Ctrls.getBrands);
router.get("/:bid", Ctrls.getBrand);
router.put("/:bid", [verifyAccessToken, isAdmin], Ctrls.updateBrand);
router.delete("/:bid", [verifyAccessToken, isAdmin], Ctrls.deleteBrand);

module.exports = router;
