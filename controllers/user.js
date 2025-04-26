const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const sendMail = require("../utils/sendMail");
const crypto = require("crypto");
const register = asyncHandler(async (req, res) => {
  const { email, password, firstname, lastname } = req.body;
  if (!email || !password || !firstname || !lastname) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }
  const isUserExisted = await User.findOne({ email });
  if (isUserExisted)
    return res.status(409).json({
      success: false,
      message: "Email already existed",
    });
  const newUser = await User.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Register successfully",
    data: newUser,
  });
});
//plain Object
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  const response = await User.findOne({ email });
  if (response && (await response.isCorrectPassword(password))) {
    //Tách password av2 role
    const { password, role, ...userData } = response.toObject();
    //Tạo access token
    const accessToken = generateAccessToken(response._id, role);
    //Tạo refresh token
    const refreshToken = generateRefreshToken(response._id);
    //Lưu refresh token vào database
    await User.findByIdAndUpdate(response._id, { refreshToken }, { new: true });
    //Lưu refresh token vào cookie
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "none",
      secure: true,
    });
    return res.status(200).json({
      success: true,
      message: "Login successfully",
      accessToken: accessToken,
      data: userData,
    });
  } else {
    return res.status(401).json({
      success: false,
      message: "Invalid Credentials",
    });
  }
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const user = await User.findById(_id).select("-refreshToken -password -role");
  return res.status(200).json({
    success: true,
    message: "Get current user successfully",
    data: user,
  });
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie?.refreshToken)
    return res.status(401).json({ success: false, message: "Unauthorized" });
  jwt.verify(
    cookie?.refreshToken,
    process.env.JWT_SECRET,
    async (err, decode) => {
      if (err)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const user = await User.findOne({
        _id: decode._id,
        refreshToken: cookie.refreshToken,
      });
      if (!user)
        return res.status(403).json({ success: false, message: "Forbidden" });
      const accessToken = generateAccessToken(user._id, user.role);
      return res.status(200).json({
        success: true,
        message: "Refresh access token successfully",
        accessToken: accessToken,
      });
    }
  );
});

const logout = asyncHandler(async (req, res) => {
  const cookie = req.cookies;
  if (!cookie || !cookie?.refreshToken)
    throw new Error("No refresh token in cookie");
  //Xóa cookie ở Database
  await User.findOneAndUpdate(
    { refreshToken: cookie.refreshToken },
    { refreshToken: "" },
    { new: true }
  );
  //Xóa cookie ở Cookie
  res.clearCookie("refreshToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res
    .status(200)
    .json({ success: true, message: "Logout successfully" });
});

// Client gửi email
// Server check email có hợp lệ hay không => Gửi mail + kèm theo link (password change token)
// Client check mail => click link
// Client gửi api kèm token
// Check token có giống với token mà server gửi mail hay không
// Change password

const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.query;
  if (!email) throw new Error("Missing email");
  const user = await User.findOne({ email });
  if (!user) throw new Error("User not found");
  const resetToken = user.createPasswordChangedToken();
  await user.save();

  const html = `Please click the link below to change your password. This link will expire in 15 minutes from now. <a href=${process.env.URL_SERVER}/user/reset-password/${resetToken}>Click here</a>`;

  const data = {
    email,
    html,
  };
  const rs = await sendMail(data);
  return res.status(200).json({
    success: true,
    rs,
  });
});
const resetPassword = asyncHandler(async (req, res) => {
  const { password, token } = req.body;
  if (!password || !token) throw new Error("Missing password or token");
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  const user = await User.findOne({
    passwordResetToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) throw new Error("Token is invalid or has expired");
  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  return res.status(200).json({
    success: true,
    message: "Reset password successfully",
  });
});

const getUsers = asyncHandler(async (req, res) => {
  const response = await User.find({ role: { $ne: "admin" } }).select(
    //không lấy danh sách tài khoản admin
    "-password -refreshToken"
  );
  return res.status(200).json({
    success: true,
    message: "Get users successfully",
    data: response,
  });
});
const deleteUser = asyncHandler(async (req, res) => {
  const { _id } = req.query;
  if (!_id) throw new Error("Missing input");
  const response = await User.findByIdAndDelete(_id);
  return res.status(203).json({
    success: response ? true : false,
    message: "Deleted user successfully",
    // data: response,
  });
});
const updateUser = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(_id, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    message: "Updated user successfully",
    data: response,
  });
});

const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { uid } = req.params;
  if (!uid || Object.keys(req.body).length === 0)
    throw new Error("Missing input");
  const response = await User.findByIdAndUpdate(uid, req.body, {
    new: true,
  }).select("-password -role -refreshToken");
  return res.status(200).json({
    success: response ? true : false,
    message: "Updated user successfully",
    data: response,
  });
});

const updateUserAddress = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  if (!_id || !req.body.address) {
    return res.status(400).json({
      success: false,
      message: "Missing Input",
    });
  }
  const response = await User.findByIdAndUpdate(
    _id,
    {
      $push: { address: req.body.address },
    },
    { new: true }
  ).select("-password -role -refreshToken");
  return res.status(200).json({
    success: true,
    message: "Updated user successfully",
    data: response,
  });
});

const updateCart = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { pid, quantity, color } = req.body;
  if (!pid || !quantity || !color)
    return res.status(400).json({
      success: false,
      message: "Missing Input",
    });
  const user = await User.findById(_id).select("cart");
  const alreadyProduct = user?.cart?.find(
    (el) => el.product.toString() === pid
  );
  if (alreadyProduct) {
    if (alreadyProduct.color === color) {
      const resposne = await User.updateOne(
        { cart: { $elemMatch: alreadyProduct } },
        { $set: { "cart.$.quantity": quantity } },
        { new: true }
      );
      return res.status(200).json({
        success: true,
        message: "Update cart successfully",
        data: resposne,
      });
    } else {
      const resposne = await User.findByIdAndUpdate(
        _id,
        {
          $push: { cart: { product: pid, quantity, color } },
        },
        { new: true }
      ).select("-password -role -refreshToken");
      return res.status(200).json({
        success: true,
        message: "Update cart successfully",
        data: resposne,
      });
    }
  } else {
    const resposne = await User.findByIdAndUpdate(
      _id,
      {
        $push: { cart: { product: pid, quantity, color } },
      },
      { new: true }
    ).select("-password -role -refreshToken");
    return res.status(200).json({
      success: true,
      message: "Update cart successfully",
      data: resposne,
    });
  }
});
module.exports = {
  register,
  login,
  getCurrentUser,
  refreshAccessToken,
  logout,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  updateUser,
  updateUserByAdmin,
  updateUserAddress,
  updateCart,
};
