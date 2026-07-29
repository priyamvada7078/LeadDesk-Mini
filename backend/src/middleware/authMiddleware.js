const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const protect = async (req, res, next) => {
  try {
    let token;
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    if (!token) {
      const error = new Error("Not authorized, no token provided");
      error.statusCode = 401;
      return next(error);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach admin info to request, excluding password
    const admin = await Admin.findById(decoded.id).select("-password");

    if (!admin) {
      const error = new Error("Not authorized, admin no longer exists");
      error.statusCode = 401;
      return next(error);
    }

    req.admin = admin;
    next();
  } catch (error) {
    error.statusCode = 401;
    error.message =
      error.name === "TokenExpiredError"
        ? "Session expired, please log in again"
        : "Not authorized, invalid token";
    next(error);
  }
};

module.exports = { protect };
