const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add the user name"],
      unique: [true, "User name already taken"],
    },
    email: {
      type: String,
      required: [true, "Please add the user email"],
      unique: [true, "Email address already taken"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: "String",
      enum: ["student", "admin"],
      default: "student",
    },
    enrollments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course", // References the Course model
      },
    ],
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("User", userSchema);
