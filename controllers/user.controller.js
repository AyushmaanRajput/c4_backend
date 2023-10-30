const { User } = require("../models/User.model");
const { BlackList } = require("../models/Blacklist.model");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
require("dotenv").config();

exports.addUser = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exist, please login" });
    }
    bcrypt.hash(password, 8, async (err, hash) => {
      if (err) {
        return res.status(500).json({ msg: "Couldn't save password" });
      }

      const user = new User({ ...req.body, password: hash });
      try {
        await user.save();
        res
          .status(200)
          .json({ msg: "User created successfully", newUser: user });
      } catch (e) {
        res
          .status(400)
          .json({ msg: "Couldn't create user, data format wrong" });
      }
    });
  } catch (e) {
    return res.status(400).json({ msg: "Something went wrong " });
  }
};

exports.login = async (req, res, next) => {
  console.log("in login route");
  const { email, password } = req.body;
  console.log(req.body);
  try {
    const user = await User.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, function (err, result) {
        // result == true
        if (err) {
          return res.status(400).json({ msg: "Invalid password,Try again" });
        }

        var token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);
        res.status(200).json({ msg: "Succcessfully logged in", token: token });
      });
    } else {
      return res
        .status(400)
        .json({ msg: "User doesn't exit,try registering a account" });
    }
  } catch (er) {
    return res
      .status(400)
      .json({ msg: "Something went wrong,try again later" });
  }
};

exports.logout = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  if (token) {
    const data = new BlackList({ token: token });
    await data.save();
    res.status(200).json({ msg: "Logged out successfully" });
  } else {
    return res.status(400).json({ msg: "Logout failed" });
  }
};
