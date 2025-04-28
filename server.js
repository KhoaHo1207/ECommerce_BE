const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRouter = require("./routes");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();
app.use(
  cors({
    origin: process.env.URL_CLIENT,
    methods: ["POST", "GET", "PUT", "DELETE"],
  })
);
app.use(cookieParser());
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

dbConnect(app);
initRouter(app);

app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
