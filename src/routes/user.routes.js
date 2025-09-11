const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");

// Create User
router.post("/signup", userController.createUser);
router.get("/fetch", userController.getUsers);
router.post("/admin/login", userController.loginAdmin);

module.exports = router;
