const mongoose = require("mongoose");

const courseSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add the course title"],
      unique: [true, "Course name already taken"],
    },
    description: {
      type: String,
      required: [true, "Please add the course description"],
    },
    duration: {
      type: String,
      required: [true, "Please add the course duration"],
    },
    instructor: {
      type: String,
      required: [true, "Please add the course instructor"],
    },
  },
  {
    timestamp: true,
  }
);

module.exports = mongoose.model("Course", courseSchema);
