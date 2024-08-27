const asyncHandler = require("express-async-handler");
const Enrollment = require("../model/enrollmentModel");
const User = require("../model/userModels");
const Course = require("../model/courseModel");

// @desc Create a new enrollment
// @route POST /api/enrollments
// @access Private (Admin only)
const createEnrollment = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;

  const student = await User.findById(studentId);
  if (!student || student.role !== "student") {
    res.status(400);
    throw new Error("Invalid student ID");
  }

  const course = await Course.findById(courseId);
  if (!course) {
    res.status(400);
    throw new Error("Invalid course ID");
  }

  const enrollment = await Enrollment.create({
    student_id: studentId,
    course_id: courseId,
  });

  res.status(201).json(enrollment);
});

// @desc Get all enrollments
// @route GET /api/enrollments
// @access Private (Admin only)
const getEnrollments = asyncHandler(async (req, res) => {
  const enrollments = await Enrollment.find().populate("student_id course_id");
  res.status(200).json(enrollments);
});

// @desc Get a specific enrollment by ID
// @route GET /api/enrollments/:id
// @access Private (Admin only)
const getEnrollmentById = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id).populate(
    "student_id course_id"
  );

  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment not found");
  }

  res.status(200).json(enrollment);
});

// @desc Update an enrollment by ID
// @route PUT /api/enrollments/:id
// @access Private (Admin only)
const updateEnrollment = asyncHandler(async (req, res) => {
  const { studentId, courseId } = req.body;
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment not found");
  }

  if (studentId) {
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      res.status(400);
      throw new Error("Invalid student ID");
    }
  }

  if (courseId) {
    const course = await Course.findById(courseId);
    if (!course) {
      res.status(400);
      throw new Error("Invalid course ID");
    }
  }

  const updatedEnrollment = await Enrollment.findByIdAndUpdate(
    req.params.id,
    { student_id: studentId, course_id: courseId },
    { new: true }
  );
  res.status(200).json(updatedEnrollment);
});

// @desc Delete an enrollment by ID
// @route DELETE /api/enrollments/:id
// @access Private (Admin only)
const deleteEnrollment = asyncHandler(async (req, res) => {
  const enrollment = await Enrollment.findById(req.params.id);

  if (!enrollment) {
    res.status(404);
    throw new Error("Enrollment not found");
  }

  await Enrollment.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: "Enrollment deleted" });
});

module.exports = {
  createEnrollment,
  getEnrollments,
  getEnrollmentById,
  updateEnrollment,
  deleteEnrollment,
};
