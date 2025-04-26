const Order = require("../models/order");
const User = require("../models/user");
const Coupon = require("../models/coupon");
const asyncHandler = require("express-async-handler");

const createOrder = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { coupon } = req.body;
  const userCart = await User.findById(_id)
    .select("cart")
    .populate("cart.product", "title price");
  const products = userCart?.cart?.map((el) => ({
    product: el.product._id,
    count: el.quantity,
    color: el.color,
  }));
  let total = userCart?.cart?.reduce(
    (sum, el) => el.product.price * el.quantity + sum,
    0
  );
  const createData = { products, total, orderBy: _id };
  if (coupon) {
    const selectedCoupon = await Coupon.findById(coupon);
    if (selectedCoupon) {
      total =
        Math.round((total * (1 - +selectedCoupon?.discount / 100)) / 1000) *
          1000 || total;

      createData.total = total;
      createData.coupon = coupon;
    } else {
      return res.status(400).json({
        success: false,
        message: "Coupon not found",
      });
    }
  }
  let response = await Order.create(createData);
  response = await response.populate("products.product", "title price");
  return res.status(200).json({
    success: true,
    message: "Create order successfully",
    data: response,
  });
});

const getUserOrder = asyncHandler(async (req, res) => {
  const response = await Order.find({ orderBy: req.user._id }).populate(
    "orderBy",
    " lastname firstname mobile email"
  );

  return res.status(200).json({
    success: true,
    message: "Get order successfully",
    data: response,
  });
});
const getOrderByAdmin = asyncHandler(async (req, res) => {
  const response = await Order.find();
  return res.status(200).json({
    success: true,
    message: "Get order successfully",
    data: response,
  });
});
const updateStatus = asyncHandler(async (req, res) => {
  const { oid } = req.params;
  const { status } = req.body;
  if (!status)
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  const response = await Order.findByIdAndUpdate(
    oid,
    { status },
    { new: true }
  );
  return res.status(200).json({
    successs: true,
    message: "Update status successfully",
    data: response,
  });
});
module.exports = { createOrder, getUserOrder, updateStatus, getOrderByAdmin };
