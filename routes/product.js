const express = require("express");
const router = express.Router();
const Ctrls = require("../controllers/product");
const { verifyAccessToken } = require("../middlewares/verifyToken");
const { isAdmin } = require("../middlewares/checkRole");
const uploader = require("../config/cloudinary.config");
router.post("/", [verifyAccessToken, isAdmin], Ctrls.createProduct);
router.get("/", Ctrls.getProducts);
router.get("/:pid", Ctrls.getProduct);
router.put("/ratings", verifyAccessToken, Ctrls.ratings);
router.put("/:pid", [verifyAccessToken, isAdmin], Ctrls.updateProduct);
router.delete("/:pid", [verifyAccessToken, isAdmin], Ctrls.deleteProduct);
router.put(
  "/upload-image/:pid",
  [verifyAccessToken, isAdmin],
  uploader.single("images"),
  Ctrls.uploadImageProduct
);
module.exports = router;
