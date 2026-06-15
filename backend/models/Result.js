const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    questionIndex: {
      type: Number,
      required: true,
    },
    questionText: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["mcq", "theory"],
      required: true,
    },
    answer: {
      type: String,
      default: "",
    },
    correctAnswer: {
      type: String,
      default: "",
    },
    isCorrect: {
      type: Boolean,
      default: null,
    },
    maxMarks: {
      type: Number,
      required: true,
    },
    awardedMarks: {
      type: Number,
      default: 0,
    },
    reviewed: {
      type: Boolean,
      default: false,
    },
    feedback: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    score: {
      type: Number,
      required: true,
    },

    totalQuestions: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    answers: {
      type: [answerSchema],
      default: [],
    },

    reviewStatus: {
      type: String,
      enum: ["completed", "pending_review"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Result", resultSchema);
