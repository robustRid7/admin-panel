const express = require("express");
const router = express.Router();
const userController = require("../controller/user.controller");
const clientInfo = require("../middleware/clientInfo");

// Create User
router.post("/signup", clientInfo, userController.createUser);
router.post("/fetch", userController.getUsers);
router.post("/admin/login", userController.loginAdmin);

module.exports = router;
