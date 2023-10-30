const express = require("express");
const app = express();

const cors = require("cors");
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");
const { connection } = require("./connection");
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use(userRoutes);
app.use("/posts", postRoutes);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
    console.log("Server running at port " + process.env.PORT);
  } catch (e) {
    console.log("Connection to DB failed");
  }
});
