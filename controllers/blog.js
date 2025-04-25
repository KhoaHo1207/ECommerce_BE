const Blog = require("../models/blog");
const asyncHandler = require("express-async-handler");

const createBlog = asyncHandler(async (req, res) => {
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const newBlog = await Blog.create({
    title,
    description,
    category,
    user: req.user._id,
  });
  return res.status(201).json({
    success: true,
    message: "Create blog successfully",
    data: newBlog,
  });
});

const getBlogs = asyncHandler(async (req, res) => {
  const blogs = await Blog.find();
  return res.status(200).json({
    success: true,
    message: "Fetch blogs successfully",
    data: blogs,
  });
});

const getBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const blog = await Blog.findByIdAndUpdate(
    bid,
    {
      $inc: { numberViews: 1 },
    },
    { new: true }
  ).populate("reactions.user", "firstname lastname");
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Fetch blog successfully",
    data: blog,
  });
});

const updateBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    return res.status(400).json({
      success: false,
      message: "Missing input",
    });
  }
  const response = await Blog.findByIdAndUpdate(bid, req.body, { new: true });
  if (!response) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }
  return res.status(200).json({
    success: response ? true : false,
    message: "Update blog successfully",
    data: response,
  });
});

const deleteBlog = asyncHandler(async (req, res) => {
  const { bid } = req.params;
  const response = await Blog.findByIdAndDelete(bid);
  if (!response) {
    return res.status(404).json({
      success: false,
      message: "Blog not found",
    });
  }
  return res.status(203).json({
    success: response ? true : false,
    message: "Delete blog successfully",
    // data: response,
  });
});

/*
    Khi người dùng like 1 bài blog thì:
    1. Check xem người đó trước đó có dislike hay không => bỏ dislike
    2. Check xem người đó trước đó cá nhân dùng like hay không => bỏ like
*/
/*
const likeBlog = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { bid } = req.params;

  if (!bid) {
    return res.status(400).json({ success: false, message: "Missing blog ID" });
  }

  const blog = await Blog.findById(bid);
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found" });
  }

  const alreadyLiked = blog.likes.includes(userId);
  const alreadyDisliked = blog.dislikes.includes(userId);

  // Nếu đã like thì bỏ like
  if (alreadyLiked) {
    blog.likes.pull(userId);
  } else {
    blog.likes.addToSet(userId);
    if (alreadyDisliked) {
      blog.dislikes.pull(userId);
    }
  }

  await blog.save();

  return res.status(200).json({
    success: true,
    message: "Toggled like successfully",
    data: {
      blogId: blog._id,
      totalLikes: blog.likes.length,
      totalDislikes: blog.dislikes.length,
      isLiked: blog.likes.includes(userId),
      isDisliked: blog.dislikes.includes(userId),
    },
  });
});

const dislikeBlog = asyncHandler(async (req, res) => {
  const { _id: userId } = req.user;
  const { bid } = req.params;

  if (!bid) {
    return res.status(400).json({ success: false, message: "Missing blog ID" });
  }

  const blog = await Blog.findById(bid);
  if (!blog) {
    return res.status(404).json({ success: false, message: "Blog not found" });
  }

  const alreadyLiked = blog.likes.includes(userId);
  const alreadyDisliked = blog.dislikes.includes(userId);

  // Nếu đã dislike thì bỏ dislike
  if (alreadyDisliked) {
    blog.dislikes.pull(userId);
  } else {
    blog.dislikes.addToSet(userId);
    if (alreadyLiked) {
      blog.likes.pull(userId);
    }
  }

  await blog.save();

  return res.status(200).json({
    success: true,
    message: "Toggled dislike successfully",
    data: {
      blogId: blog._id,
      totalLikes: blog.likes.length,
      totalDislikes: blog.dislikes.length,
      isLiked: blog.likes.includes(userId),
      isDisliked: blog.dislikes.includes(userId),
    },
  });
});
*/
// const reactToBlog = asyncHandler(async (req, res) => {
//   const { _id } = req.user;
//   const { bid } = req.params;
//   const { type } = req.body;

//   if (!["like", "dislike", "neutral"].includes(type)) {
//     return res.status(400).json({
//       success: false,
//       message: "Invalid reaction type",
//     });
//   }

//   const blog = await Blog.findById(bid);
//   if (!blog) {
//     return res.status(404).json({
//       success: false,
//       message: "Blog not found",
//     });
//   }

//   const updateOps = {
//     $pull: { likes: _id, dislikes: _id },
//   };

//   if (type === "like") {
//     updateOps.$addToSet = { likes: _id };
//   } else if (type === "dislike") {
//     updateOps.$addToSet = { dislikes: _id };
//   }

//   const updatedBlog = await Blog.findByIdAndUpdate(bid, updateOps, {
//     new: true,
//   });

//   return res.status(200).json({
//     success: true,
//     message: "Reaction updated",
//     data: updatedBlog,
//   });
// });
const reactToBlog = asyncHandler(async (req, res) => {
  const { _id } = req.user;
  const { bid } = req.params;
  const { type } = req.body;

  const validReactions = ["like", "dislike", "love", "angry", "haha", "sad"];
  if (!type || !validReactions.includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid or missing reaction type.",
    });
  }

  const blog = await Blog.findById(bid);
  if (!blog) {
    return res.status(404).json({
      success: false,
      message: "Blog not found.",
    });
  }

  // Kiểm tra user đã từng react chưa
  const existingReactionIndex = blog.reactions.findIndex(
    (r) => r.user.toString() === _id
  );

  if (existingReactionIndex !== -1) {
    const currentType = blog.reactions[existingReactionIndex].type;

    if (currentType === type) {
      // Nếu người dùng click lại cùng loại reaction → xóa reaction (bỏ like/dislike)
      blog.reactions.splice(existingReactionIndex, 1);
    } else {
      // Nếu khác loại → update lại reaction
      blog.reactions[existingReactionIndex].type = type;
    }
  } else {
    // Nếu chưa từng react → thêm mới
    blog.reactions.push({ user: _id, type });
  }

  await blog.save();

  return res.status(200).json({
    success: true,
    message: "Reacted to blog successfully.",
    data: blog,
  });
});

module.exports = {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  //   likeBlog,
  //   dislikeBlog,
  reactToBlog,
};
