const Product = require("../models/product");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

const createProduct = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  if (req.body && req.body.title) req.body.slug = slugify(req.body.title);
  const newProduct = await Product.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Create product successfully",
    data: newProduct,
  });
});

const getProducts = asyncHandler(async (req, res) => {
  const product = await Product.find();
  return res.status(200).json({
    success: true,
    message: "Get products successfully",
    data: product,
  });
});

const getProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const product = await Product.findById(pid);
  if (!product)
    return res
      .status(400)
      .json({ success: false, message: "Product not found" });
  return res.status(200).json({
    success: true,
    message: "Get product successfully",
    data: product,
  });
});

const updateProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;

  // Validate: Check input
  if (!pid || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Missing product ID or update data",
    });
  }

  // Generate slug if title exists
  if (req.body.title) {
    req.body.slug = slugify(req.body.title);
  }

  // Update and return the result
  const updatedProduct = await Product.findByIdAndUpdate(pid, req.body, {
    new: true,
    runValidators: true,
  });

  // Not found case
  if (!updatedProduct) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  // Success response
  return res.status(200).json({
    success: true,
    message: "Product updated successfully",
    data: updatedProduct,
  });
});

const deleteProduct = asyncHandler(async (req, res) => {
  const { pid } = req.params;
  const deletedProduct = await Product.findByIdAndDelete(pid);
  if (!deletedProduct)
    return res
      .status(400)
      .json({ success: false, message: "Product not found" });
  return res.status(203).json({
    success: true,
    message: "Delete product successfully",
    // data: deletedProduct,
  });
});
module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
};
