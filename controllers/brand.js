const Brand = require("../models/brand");
const asyncHandler = require("express-async-handler");

const createBrand = asyncHandler(async (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const newBrand = await Brand.create({
    title,
  });
  return res.status(201).json({
    success: true,
    message: "Create brand successfully",
    data: newBrand,
  });
});

const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find();
  return res.status(200).json({
    success: true,
    message: "Fetch brands successfully",
    data: brands,
  });
});

const getBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const brand = await Brand.findById(bid);
  if (!brand) {
    return res.status(404).json({
      success: false,
      message: "Brand not found",
    });
  }
  return res.status(200).json({
    success: brand ? true : false,
    message: "Get brand successfully",
    data: brand,
  });
});

const updateBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const response = await Brand.findByIdAndUpdate(bid, req.body, { new: true });
  if (!response) {
    return res.status(404).json({
      success: false,
      message: "Brand not found",
    });
  }
  return res.status(200).json({
    success: response ? true : false,
    message: "Update brand successfully",
    data: response,
  });
});

const deleteBrand = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Brand.findByIdAndDelete(bid);
  if (!response) {
    return res.status(404).json({
      success: false,
      message: "Brand not found",
    });
  }
  return res.status(203).json({
    success: response ? true : false,
    message: "Delete brand successfully",
    // data: response,
  });
});
module.exports = { createBrand, getBrands, getBrand, updateBrand, deleteBrand };
