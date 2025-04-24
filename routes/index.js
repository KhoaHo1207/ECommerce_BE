const router = require("express").Router();
const { NotFound, errHandler } = require("../middlewares/errHandler");
const userRouter = require("./user");
const productRouter = require("./product");
const initRouter = (app) => {
  app.use("/api/v1/user", userRouter);
  app.use("/api/v1/product", productRouter);

  app.use(NotFound);
  app.use(errHandler);
};

module.exports = initRouter;
