const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  refreshAuth,
} = require("../controllers/auth.controller");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validateRegister");

router.post("/register", validateRegister, registerUser);
router.post("/login", validateLogin, loginUser);
router.post("/refresh", refreshAuth);
module.exports = router;
