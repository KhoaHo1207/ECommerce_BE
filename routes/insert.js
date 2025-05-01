const express = require("express");
const router = express.Router();
const Ctrls = require("../controllers/insertData");
router.post("/product", Ctrls.insertProduct);
router.post("/category", Ctrls.insertProductCategory);

module.exports = router;
