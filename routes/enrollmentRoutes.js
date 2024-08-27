const express = require("express");
const {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
} = require("../controllers/enrollmentController");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const adminOnlyMiddleware = require("../middleware/adminOnlyMiddleware");
const router = express.Router();

router.use(validateTokenHandler, adminOnlyMiddleware);

router
  .route("/")
  .post(createEnrollment) // Create a new enrollment
  .get(getEnrollments); // Get all enrollments

router
  .route("/:id")
  .get(getEnrollmentById) // Get a specific enrollment by ID
  .put(updateEnrollment) // Update a specific enrollment by ID
  .delete(deleteEnrollment); // Delete a specific enrollment by ID

module.exports = router;
