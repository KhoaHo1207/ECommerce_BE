const router = require("express").Router();
const { NotFound, errHandler } = require("../middlewares/errHandler");
const userRouter = require("./user");
const productRouter = require("./product");
const productCategoryRouter = require("./productCategory");
const blogCategoryRouter = require("./blogCategory");
const initRouter = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/product", productRouter);
  app.use("/api/v1/productCategory", productCategoryRouter);
  app.use("/api/v1/blogCategory", blogCategoryRouter);

  app.use(NotFound);
  app.use(errHandler);
};

module.exports = initRouter;
