const express = require("express");
const { body } = require("express-validator");
const { loginAdmin } = require("../controllers/authController");

const router = express.Router();

const loginValidator = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),
  body("password").notEmpty().withMessage("Password is required"),
];

// POST /api/auth/login
router.post("/login", loginValidator, loginAdmin);

module.exports = router;
