const express = require("express");
const {
  register,
  login,
  resetPassword,
  resetEmail,
} = require("../controllers/userController");

const router = express.Router();

// Rute pengguna
router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.post("/reset-email", resetEmail);

module.exports = router;