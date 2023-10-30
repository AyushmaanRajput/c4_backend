const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");

router.post("/users/register", userController.addUser);

router.post("/users/login", userController.login);

router.post('/logout',userController.logout);

module.exports = router;
