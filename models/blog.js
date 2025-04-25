const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    numberViews: {
      type: Number,
      default: 0,
    },
    // likes: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    // dislikes: [
    //   {
    //     type: mongoose.Types.ObjectId,
    //     ref: "User",
    //   },
    // ],
    reactions: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" },
        type: {
          type: String,
          enum: ["like", "dislike", "love", "angry", "haha", "sad"],
        },
      },
    ],

    image: {
      type: String,
      default:
        "https://plus.unsplash.com/premium_photo-1661265944044-bc7248ae54f9?fm=jpg&q=60&w=3000",
    },
    author: {
      type: String,
      default: "Admin",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Blog", blogSchema);
