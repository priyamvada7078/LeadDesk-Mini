const express = require("express");
const {
  createLead,
  getLeads,
  updateLeadStatus,
  deleteLead,
} = require("../controllers/leadController");
const { protect } = require("../middleware/authMiddleware");
const {
  createLeadValidator,
  updateLeadStatusValidator,
  leadIdValidator,
} = require("../validators/leadValidator");

const router = express.Router();

// POST /api/leads - Public
router.post("/", createLeadValidator, createLead);

// GET /api/leads - Protected
router.get("/", protect, getLeads);

// PATCH /api/leads/:id - Protected
router.patch("/:id", protect, updateLeadStatusValidator, updateLeadStatus);

// DELETE /api/leads/:id - Protected
router.delete("/:id", protect, leadIdValidator, deleteLead);

module.exports = router;
