const asyncHandler = require("express-async-handler");

const adminOnlyMiddleware = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // The user is an admin, proceed to the next middleware/controller
  } else {
    res.status(403); // Forbidden
    throw new Error("Access denied. Admins only.");
  }
});

module.exports = adminOnlyMiddleware;
