const { body, param } = require("express-validator");

// Validation rules for creating a new lead (public route)
const createLeadValidator = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email address"),

  body("budget")
    .trim()
    .notEmpty()
    .withMessage("Budget is required"),

  body("message")
    .trim()
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10 })
    .withMessage("Message must be at least 10 characters long"),
];

// Validation rules for updating a lead's status (protected route)
const updateLeadStatusValidator = [
  param("id").isMongoId().withMessage("Invalid lead ID"),

  body("status")
    .trim()
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["New", "Contacted", "Closed"])
    .withMessage("Status must be one of: New, Contacted, Closed"),
];

// Validation rule for :id params used in GET/DELETE by id
const leadIdValidator = [
  param("id").isMongoId().withMessage("Invalid lead ID"),
];

module.exports = {
  createLeadValidator,
  updateLeadStatusValidator,
  leadIdValidator,
};
