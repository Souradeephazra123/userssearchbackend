require("dotenv").config();
const express = require("express");
const app = express();
const router = require("./Routes/router");

require("./DB/conn");
const cors = require("cors");
app.use(cors());
const PORT = process.env.PORT || 6010;

app.get("/", (req, res) => {
  res.status(201).json("server start");
});

app.use(express.json());
app.use(router);
//when we call /uploads route ,then it call Uploads folder
app.use("/Uploads", express.static("./Uploads"));
// const server = app.listen(PORT, () => {
//   console.log(`Server has started at ${PORT}`);
// });
// server.timeout = 60000;

app.listen(PORT, () => {
  console.log(`Server has started at ${PORT}`);
});
