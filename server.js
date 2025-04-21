const express = require("express");
require("dotenv").config();
const dbConnect = require("./config/dbconnect");
const initRouter = require("./routes");

const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extends: true }));

dbConnect(app);
initRouter(app);

app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
