const asyncHandler = require("express-async-handler");
const Course = require("../model/courseModel");

const createCourse = asyncHandler(async (req, res) => {
  const { title, description, duration, instructor } = req.body;

  if (!title || !description || !duration || !instructor) {
    res.status(400);
    throw new Error("All Field Are Required");
  }

  const courseAvailable = await Course.findOne({ title });
  if (courseAvailable) {
    res.status(400);
    throw new Error("Course Name Already Inserted");
  }

  const course = await Course.create({
    title,
    description,
    duration,
    instructor,
  });
  res.status(201).json(course);
});

const updateCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  const { title } = req.body;

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Check if the new title already exists for another course
  if (title) {
    const courseAvailable = await Course.findOne({
      title,
      _id: { $ne: req.params.id }, // Exclude the current course from the search
    });

    if (courseAvailable) {
      res.status(400);
      throw new Error("Course title already in use by another course");
    }
  }

  const updateCourse = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updateCourse);
});

const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  await Course.deleteOne({ _id: req.params.id });
  res.status(200).json({
    course,
  });
});

const getAllCourses = asyncHandler(async (req, res) => {
  const course = await Course.find();

  res.status(200).json({
    course,
  });
});

module.exports = {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllCourses,
  //   getProduct,
};

// const getProduct = asyncHandler(async (req, res) => {
//     const product = await Product.findById(req.params.id);

//     if (!product) {
//       res.status(404);
//       throw new Error("Product not found");
//     }
//     res.status(200).json(product);
//   });
