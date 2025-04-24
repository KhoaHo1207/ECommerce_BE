const express = require("express");
const router = express.Router();
const Ctrls = require("../controllers/productCategory");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
router.get("/", Ctrls.getProductCategories);
router.get("/:pcid", Ctrls.getProductCategory);
router.post("/", [verifyAccessToken, isAdmin], Ctrls.createProductCategory);
router.put("/:pcid", [verifyAccessToken, isAdmin], Ctrls.updateProductCategory);
router.delete(
  "/:pcid",
  [verifyAccessToken, isAdmin],
  Ctrls.deleteProductCategory
);

module.exports = router;
