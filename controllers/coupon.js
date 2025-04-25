const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createCoupon = asyncHandler(async (req, res) => {
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry)
    return res.status(400).json({
      success: false,
      messgae: "Missing input",
    });
  const coupon = await Coupon.create({
    ...req.body,
    expiry: Date.now() + expiry * 24 * 60 * 60 * 1000,
  });
  if (!coupon)
    return res.status(400).json({
      success: false,
      message: "Create coupon failed",
    });
  return res.status(201).json({
    success: true,
    message: "Create coupon successfully",
    data: coupon,
  });
});

const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find();
  return res.status(200).json({
    success: true,
    message: "Fetch coupons successfully",
    data: coupons,
  });
});

const getCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const coupon = await Coupon.findById(cid);
  if (!coupon)
    return res.status(400).json({
      success: false,
      message: "Coupon not found",
    });
  return res.status(200).json({
    success: true,
    message: "Get coupon successfully",
    data: coupon,
  });
});

const updateCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const { name, discount, expiry } = req.body;
  if (!name || !discount || !expiry)
    return res.status(400).json({
      success: false,
      messgae: "Missing input",
    });
  const response = await Coupon.findByIdAndUpdate(
    cid,
    {
      ...req.body,
      expiry: Date.now() + expiry * 24 * 60 * 60 * 1000,
    },
    { new: true }
  );
  if (!response)
    return res.status(400).json({
      success: false,
      message: "Update coupon failed",
    });
  return res.status(200).json({
    success: true,
    message: "Update coupon successfully",
    data: response,
  });
});

const deleteCoupon = asyncHandler(async (req, res) => {
  const { cid } = req.params;
  const response = await Coupon.findByIdAndDelete(cid);
  if (!response)
    return res.status(400).json({
      success: false,
      message: "Delete coupon failed",
    });
  return res.status(203).json({
    success: true,
    message: "Delete coupon successfully",
    // data: response,
  });
});
module.exports = {
  createCoupon,
  getCoupons,
  getCoupon,
  updateCoupon,
  deleteCoupon,
};
