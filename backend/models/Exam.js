const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: true,
  },
  options: [
    {
      type: String,
      required: true,
    },
  ],
  correctAnswer: {
    type: String,
    required: true,
  },
});

const examSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    duration: {
      type: Number, // in minutes
      required: true,
    },

    questions: [questionSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Exam", examSchema);
