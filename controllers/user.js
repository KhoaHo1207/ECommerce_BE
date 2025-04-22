const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwt");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

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

module.exports = { register, login, getCurrentUser };
