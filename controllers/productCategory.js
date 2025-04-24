const ProductCategory = require("../models/productCategory");
const asyncHandler = require("express-async-handler");
const createProductCategory = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const newProductCategory = await ProductCategory.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Create product category successfully",
    data: newProductCategory,
  });
});

const getProductCategories = asyncHandler(async (req, res) => {
  const productCategories = await ProductCategory.find().select("title _id");
  return res.status(200).json({
    success: true,
    message: "Fetch product category successfully",
    data: productCategories,
  });
});

const getProductCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const productCategory = await ProductCategory.findById(pcid); // Sử dụng findById để tìm theo ID
  if (!productCategory)
    return res
      .status(404) // Sửa mã trạng thái thành 404 (Not Found)
      .json({ success: false, message: "Product category not found" });
  return res.status(200).json({
    success: true,
    message: "Get product category successfully",
    data: productCategory,
  });
});

const updateProductCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const { title } = req.body;

  // Kiểm tra đầu vào
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Missing title",
    });
  }

  // Cập nhật danh mục sản phẩm
  const updatedProductCategory = await ProductCategory.findByIdAndUpdate(
    pcid,
    { title },
    {
      new: true,
      runValidators: true,
    }
  );

  // Nếu không tìm thấy
  if (!updatedProductCategory) {
    return res.status(404).json({
      success: false,
      message: "Product category not found",
    });
  }

  // Thành công
  return res.status(200).json({
    success: true,
    message: "Fetch product category successfully",
    data: updatedProductCategory,
  });
});

const deleteProductCategory = asyncHandler(async (req, res) => {
  const { pcid } = req.params;
  const deletedProductCategory = await ProductCategory.findByIdAndDelete(pcid);
  if (!deletedProductCategory)
    return res
      .status(400)
      .json({ success: false, message: "Product category not found" });
  return res.status(203).json({
    success: true,
    message: "Delete product category successfully",
    // data: deletedProduct,
  });
});
module.exports = {
  createProductCategory,
  getProductCategories,
  getProductCategory,
  updateProductCategory,
  deleteProductCategory,
};
