const asyncHandler = require("express-async-handler");
const User = require("../model/userModels");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");

//@desc Register a user
//@route POST api/user/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error("All Field Are Required");
  }

  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User Already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    role,
  });

  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data are not valid");
  }

  res.json({ message: "Register the user" });
});

//@desc Register a user
//@route POST api/user/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("All Field Are Required");
  }

  const user = await User.findOne({ email });

  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = await jwt.sign(
      {
        user: {
          username: user.name,
          email: user.email,
          id: user._id,
          role: user.role,
        },
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "45m" }
    );

    res.status(200).json({ accessToken });
  } else {
    res.status(401);
    throw new Error("Email or Password is not valid");
  }
});

//@desc Current user
//@route POST api/user/login
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

// @desc Get all students
// @route GET api/user/students
// @access Private/Admin
const getAllStudents = asyncHandler(async (req, res) => {
  const students = await User.find({ role: "student" });
  res.status(200).json(students);
});

// @desc Get a student by ID
// @route GET api/user/students/:id
// @access Private/Admin
const getStudentById = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);

  if (student && student.role === "student") {
    res.status(200).json(student);
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

// @desc Update a student
// @route PUT api/user/students/:id
// @access Private/Admin
const updateStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);

  if (student && student.role === "student") {
    student.name = req.body.name || student.name;
    student.email = req.body.email || student.email;
    if (req.body.password) {
      student.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedStudent = await student.save();
    res.status(200).json(updatedStudent);
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

// @desc Delete a student
// @route DELETE api/user/students/:id
// @access Private/Admin
const deleteStudent = asyncHandler(async (req, res) => {
  const student = await User.findById(req.params.id);

  if (student && student.role === "student") {
    // await student.remove();
    await User.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: "Student removed" });
  } else {
    res.status(404);
    throw new Error("Student not found");
  }
});

module.exports = {
  registerUser,
  loginUser,
  currentUser,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};
