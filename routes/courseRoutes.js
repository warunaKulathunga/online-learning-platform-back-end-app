const express = require("express");
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
} = require("../controllers/courseController");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const adminOnlyMiddleware = require("../middleware/adminOnlyMiddleware");
const router = express.Router();

router.use(validateTokenHandler, adminOnlyMiddleware);
router.route("/").get(getAllCourses).post(createCourse);
router.route("/:id").put(updateCourse).delete(deleteCourse);

module.exports = router;
