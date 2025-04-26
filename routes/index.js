const router = require("express").Router();
const { NotFound, errHandler } = require("../middlewares/errHandler");
const userRouter = require("./user");
const productRouter = require("./product");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const blogRouter = require("./blog");
const brandRouter = require("./brand");
const couponRouter = require("./coupon");
const orderRouter = require("./order");
const initRouter = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/productCategory", productCategoryRouter);
  app.use("/api/v1/blogCategory", blogCategoryRouter);
  app.use("/api/v1/blog", blogRouter);
  app.use("/api/v1/brand", brandRouter);
  app.use("/api/v1/coupon", couponRouter);
  app.use("/api/v1/order", orderRouter);

  app.use(NotFound);
  app.use(errHandler);
};

module.exports = initRouter;
