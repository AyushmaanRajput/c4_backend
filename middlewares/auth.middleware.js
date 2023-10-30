const jwt = require("jsonwebtoken");
const { BlackList } = require("../models/Blacklist.model");
require("dotenv").config();
const auth = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (token) {
    const blacklistedToken = await BlackList.findOne({ token: token });
    if (blacklistedToken) {
      return res.status(400).json({ msg: "Session Expired, Login Again" });
    }

    jwt.verify(token, process.env.JWT_KEY, function (err, decoded) {
      if (decoded) {
        req.body.userId = decoded.userId;
        next();
      } else {
        return res.status(400).json({ msg: "Unauthorized" });
      }
    });
  } else {
    res.status(400).json({ msg: "Unauthorized" });
  }
};

module.exports = { auth };
