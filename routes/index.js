const router = require("express").Router();
const { NotFound, errHandler } = require("../middlewares/errHandler");
const userRouter = require("./user");
const initRouter = (app) => {
  app.use("/api/v1/user", userRouter);

  app.use(NotFound);
  app.use(errHandler);
};

module.exports = initRouter;
