const router = require("express").Router();
const userRouter = require("./user");
const initRouter = (app) => {
  app.use("/api/v1/user", userRouter);
};

module.exports = initRouter;
