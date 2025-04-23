const asyncHandler = require("express-async-handler");

const isAdmin = asyncHandler(async (req, res, next) => {
  const { role } = req.user;
  if (role.trim().toLowerCase() !== "admin")
    return res.status(403).json({ success: false, message: "Forbidden" });
  next();
});

module.exports = { isAdmin };
