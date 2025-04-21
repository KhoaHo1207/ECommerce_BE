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

module.exports = { register };
