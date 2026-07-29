const { validationResult } = require("express-validator");
const Lead = require("../models/Lead");

// @route   POST /api/leads
// @access  Public
const createLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { name, email, budget, message } = req.body;

    await Lead.create({ name, email, budget, message });

    res.status(201).json({
      success: true,
      message: "Lead submitted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/leads
// @access  Protected
const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: leads.length,
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

// @route   PATCH /api/leads/:id
// @access  Protected
const updateLeadStatus = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      const error = new Error("Lead not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Lead status updated successfully",
      data: lead,
    });
  } catch (error) {
    next(error);
  }
};

// @route   DELETE /api/leads/:id
// @access  Protected
const deleteLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
      });
    }

    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);

    if (!lead) {
      const error = new Error("Lead not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      message: "Lead deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { createLead, getLeads, updateLeadStatus, deleteLead };
