const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ["jpg", "png"],
  //   filename: function (req, file, cb) {
  //     cb(null, file.originalname);
  //   },
  params: {
    folder: "ShopSphere",
  },
});

const uploadCloud = multer({ storage });

module.exports = uploadCloud;
