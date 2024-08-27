const express = require("express");
const {
  registerUser,
  loginUser,
  currentUser,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
} = require("../controllers/userController");
const validateTokenHandler = require("../middleware/validateTokenHandler");
const adminOnlyMiddleware = require("../middleware/adminOnlyMiddleware");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/current", validateTokenHandler, currentUser);

router.use(validateTokenHandler, adminOnlyMiddleware);

router
  .route("/")
  .get(getAllStudents) // GET all students
  .post(registerUser); // POST a new student

router
  .route("/:id")
  .get(getStudentById) // GET a student by ID
  .put(updateStudent) // PUT (update) a student by ID
  .delete(deleteStudent); // DELETE a student by ID

module.exports = router;
