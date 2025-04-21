const express = require("express");
require("dotenv").config();
const app = express();

const PORT = process.env.PORT || 8080;
app.use(express.json());
app.use(express.urlencoded({ extends: true }));
app.use("/", (req, res) => res.send("Con me may"));

app.listen(PORT, (req, res) => {
  console.log(`Server running on port ${PORT}`);
});
