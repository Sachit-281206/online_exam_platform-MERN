const mongoose = require("mongoose");

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const normalizeString = (value) =>
  typeof value === "string" ? value.trim() : "";

const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const isValidObjectId = (value) => mongoose.Types.ObjectId.isValid(value);

const validateQuestions = (questions) => {
  if (!Array.isArray(questions) || questions.length === 0) {
    return "At least one question is required";
  }

  for (let index = 0; index < questions.length; index += 1) {
    const question = questions[index];
    const questionNumber = index + 1;

    if (!isNonEmptyString(question?.questionText)) {
      return `Question ${questionNumber} must have text`;
    }

    const type = normalizeString(question?.type || "mcq");
    if (!["mcq", "theory"].includes(type)) {
      return `Question ${questionNumber} has an invalid type`;
    }

    const maxMarks = Number(question?.maxMarks ?? 1);
    if (!Number.isInteger(maxMarks) || maxMarks <= 0) {
      return `Question ${questionNumber} must have valid marks`;
    }

    if (type === "mcq") {
      if (!Array.isArray(question?.options) || question.options.length < 2) {
        return `Question ${questionNumber} must have at least two options`;
      }

      const normalizedOptions = question.options.map(normalizeString);
      if (normalizedOptions.some((option) => !option)) {
        return `Question ${questionNumber} has an empty option`;
      }

      if (new Set(normalizedOptions).size !== normalizedOptions.length) {
        return `Question ${questionNumber} has duplicate options`;
      }

      const correctAnswer = normalizeString(question.correctAnswer);
      if (!correctAnswer) {
        return `Question ${questionNumber} must have a correct answer`;
      }

      if (!normalizedOptions.includes(correctAnswer)) {
        return `Question ${questionNumber} has an invalid correct answer`;
      }
    }

    if (type === "theory" && normalizeString(question.correctAnswer)) {
      return `Question ${questionNumber} should not have a correct answer`;
    }
  }

  return null;
};

module.exports = {
  isNonEmptyString,
  normalizeString,
  isValidEmail,
  isValidObjectId,
  validateQuestions,
};
