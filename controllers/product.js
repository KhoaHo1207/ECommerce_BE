const { response } = require("express");
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
//Filtering, sorting & pagination
const getProducts = asyncHandler(async (req, res) => {
  const queries = { ...req.query };

  // Loại bỏ các field không dùng để lọc
  const excludeFields = ["limit", "sort", "page", "fields"];
  excludeFields.forEach((el) => delete queries[el]);

  // Hàm format các toán tử như gte, lte thành cú pháp Mongoose
  const formatQueryOperators = (queries) => {
    const formatted = {};
    Object.keys(queries).forEach((key) => {
      const match = key.match(/(.*)\[(gte|gt|lt|lte)]/);
      if (match) {
        const field = match[1];
        const operator = `$${match[2]}`;
        if (!formatted[field]) formatted[field] = {};
        formatted[field][operator] = queries[key];
      } else {
        formatted[key] = queries[key];
      }
    });
    return formatted;
  };

  const formattedQueries = formatQueryOperators(queries);

  // Thêm filter tìm kiếm theo tiêu đề
  if (queries?.title)
    formattedQueries.title = { $regex: queries.title, $options: "i" };

  // Tạo truy vấn
  let queryCommand = Product.find(formattedQueries);

  // Sắp xếp
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    queryCommand = queryCommand.sort(sortBy); // Ví dụ: sort=price,-createdAt
  } else {
    queryCommand = queryCommand.sort("-createdAt"); // Mặc định: mới nhất
  }

  // Phân trang
  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;
  queryCommand = queryCommand.skip(skip).limit(limit);

  try {
    const [response, counts] = await Promise.all([
      queryCommand,
      Product.find(formattedQueries).countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      message: "Lấy danh sách sản phẩm thành công",
      totalProduct: counts,
      limit: limit,
      currentPage: page,
      totalPages: Math.ceil(counts / limit),
      data: response,
    });
  } catch (err) {
    throw new Error(err.message);
  }
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

const ratings = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { star, comment, pid } = req.body;
  if (!star || !pid) throw new Error("Missing Inputs");
  const ratingProduct = await Product.findById(pid);
  if (!ratingProduct)
    return res.status(400).json({
      success: false,
      message: "Product not found",
    });
  const alreadyRating = ratingProduct?.ratings?.some(
    (el) => el.postedBy.toString() === _id
  );
  if (alreadyRating) {
    //update star & commnent
    await Product.updateOne(
      {
        ratings: { $elemMatch: { postedBy: _id } },
      },
      {
        $set: {
          "ratings.$.star": star,
          "ratings.$.comment": comment,
        },
      },
      {
        new: true,
      }
    );
  } else {
    //add star & comment
    const response = await Product.findByIdAndUpdate(
      pid,
      {
        $push: {
          ratings: {
            star: star,
            comment: comment,
            postedBy: _id,
          },
        },
      },
      { new: true }
    );
  }

  //Sum Ratings
  const updatedProduct = await Product.findById(pid);
  const ratingCount = updatedProduct.ratings.length;
  const sumRatings = updatedProduct.ratings.reduce(
    (sum, el) => sum + +el.star,
    0
  );
  updatedProduct.totalRatings =
    Math.round((sumRatings * 10) / ratingCount) / 10;
  await updatedProduct.save();
  return res.status(200).json({
    success: true,
    message: "Comment successfully",
    data: updatedProduct,
  });
});
module.exports = {
  createProduct,
  getProduct,
  getProducts,
  updateProduct,
  deleteProduct,
  ratings,
};
