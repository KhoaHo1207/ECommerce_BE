const BlogCategory = require("../models/blogCategory");
const asyncHandler = require("express-async-handler");

const createBlogCategory = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) throw new Error("Missing input");
  const newBlogCategory = await BlogCategory.create(req.body);
  return res.status(201).json({
    success: true,
    message: "Create blog category successfully",
    data: newBlogCategory,
  });
});

const getBlogCategories = asyncHandler(async (req, res) => {
  const blogCategories = await BlogCategory.find().select("title _id");
  return res.status(200).json({
    success: true,
    message: "Fetch blog category successfully",
    data: blogCategories,
  });
});

const getBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const blogCategory = await BlogCategory.findById(bcid); // Sử dụng findById để tìm theo ID
  if (!blogCategory)
    return res
      .status(404) // Sửa mã trạng thái thành 404 (Not Found)
      .json({ success: false, message: "Product category not found" });
  return res.status(200).json({
    success: true,
    message: "Get blog category successfully",
    data: blogCategory,
  });
});

const updateBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const { title } = req.body;

  // Kiểm tra đầu vào
  if (!title) {
    return res.status(400).json({
      success: false,
      message: "Missing title",
    });
  }

  // Cập nhật danh mục sản phẩm
  const updatedBlogCategory = await BlogCategory.findByIdAndUpdate(
    bcid,
    { title },
    {
      new: true,
      runValidators: true,
    }
  );

  // Nếu không tìm thấy
  if (!updatedBlogCategory) {
    return res.status(404).json({
      success: false,
      message: "Blog category not found",
    });
  }

  // Thành công
  return res.status(200).json({
    success: true,
    message: "Fetch blog category successfully",
    data: updatedBlogCategory,
  });
});

const deleteBlogCategory = asyncHandler(async (req, res) => {
  const { bcid } = req.params;
  const deletedBlogCategory = await BlogCategory.findByIdAndDelete(bcid);
  if (!deletedBlogCategory)
    return res
      .status(400)
      .json({ success: false, message: "Blog category not found" });
  return res.status(203).json({
    success: true,
    message: "Delete blog category successfully",
    // data: deletedProduct,
  });
});
module.exports = {
  createBlogCategory,
  getBlogCategories,
  getBlogCategory,
  updateBlogCategory,
  deleteBlogCategory,
};
