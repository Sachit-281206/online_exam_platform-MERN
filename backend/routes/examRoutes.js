const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Exam = require("../models/Exam");
const Class = require("../models/Class");
const Result = require("../models/Result");
const {
  isNonEmptyString,
  normalizeString,
  isValidObjectId,
  validateQuestions,
} = require("../utils/validation");

const router = express.Router();

/*
   @route   POST /api/exams/create
   @desc    Teacher creates exam for a class
*/
router.post("/create", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create exams" });
    }

    const title = normalizeString(req.body.title);
    const classId = req.body.classId;
    const duration = Number(req.body.duration);
    const { questions } = req.body;

    if (!isNonEmptyString(title)) {
      return res.status(400).json({ message: "Exam title is required" });
    }

    if (!isValidObjectId(classId)) {
      return res.status(400).json({ message: "Valid class ID is required" });
    }

    if (!Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({ message: "Duration must be a positive number of minutes" });
    }

    const questionError = validateQuestions(questions);
    if (questionError) {
      return res.status(400).json({ message: questionError });
    }

    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classData.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this class" });
    }

    const sanitizedQuestions = questions.map((question) => ({
      type: normalizeString(question.type || "mcq"),
      questionText: normalizeString(question.questionText),
      options:
        normalizeString(question.type || "mcq") === "mcq"
          ? question.options.map((option) => normalizeString(option))
          : [],
      correctAnswer:
        normalizeString(question.type || "mcq") === "mcq"
          ? normalizeString(question.correctAnswer)
          : "",
      maxMarks: Number(question.maxMarks ?? 1),
    }));

    const exam = await Exam.create({
      title,
      class: classId,
      duration,
      questions: sanitizedQuestions,
    });
    res.status(201).json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/exams/class/:classId
   @desc    Student views exams for their class
*/
router.get("/class/:classId", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can view exams this way" });
    }

    if (!isValidObjectId(req.params.classId)) {
      return res.status(400).json({ message: "Valid class ID is required" });
    }

    // Verify student is enrolled in this class
    const classData = await Class.findOne({
      _id: req.params.classId,
      students: req.user._id
    });

    if (!classData) {
      return res.status(403).json({ message: "Not enrolled in this class" });
    }

    const exams = await Exam.find({ class: req.params.classId }).select("-questions.correctAnswer");
    const examIds = exams.map((exam) => exam._id);
    const attemptedResults = await Result.find({
      exam: { $in: examIds },
      student: req.user._id,
    }).select("exam reviewStatus score totalMarks");

    const attemptedResultMap = new Map(
      attemptedResults.map((result) => [result.exam.toString(), result])
    );

    const examsWithAttemptStatus = exams.map((exam) => ({
      ...exam.toObject(),
      attempted: attemptedResultMap.has(exam._id.toString()),
      reviewStatus: attemptedResultMap.get(exam._id.toString())?.reviewStatus || null,
      score: attemptedResultMap.get(exam._id.toString())?.score ?? null,
      totalMarks: attemptedResultMap.get(exam._id.toString())?.totalMarks ?? null,
    }));

    res.json(examsWithAttemptStatus);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// Student checks if they already attempted this exam
router.get("/check-attempt/:examId", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can check attempt status" });
    }

    if (!isValidObjectId(req.params.examId)) {
      return res.status(400).json({ message: "Valid exam ID is required" });
    }

    const result = await Result.findOne({
      exam: req.params.examId,
      student: req.user._id,
    });

    res.json({ alreadyAttempted: !!result });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/exams/my-results
   @desc    Student views their past exam results
*/
router.get("/my-results", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can view their results" });
    }

    const results = await Result.find({ student: req.user._id })
      .sort({ createdAt: -1 })
      .populate({
        path: "exam",
        select: "title class",
        populate: {
          path: "class",
          select: "className",
        },
      });

    const formattedResults = results
      .filter((result) => result.exam)
      .map((result) => ({
        _id: result._id,
        examId: result.exam._id,
        examTitle: result.exam.title,
        className: result.exam.class?.className || "Class unavailable",
        score: result.score,
        totalMarks: result.totalMarks,
        totalQuestions: result.totalQuestions,
        reviewStatus: result.reviewStatus,
        submittedAt: result.createdAt,
      }));

    res.json(formattedResults);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/exams/teacher-class/:classId
   @desc    Teacher views exams for their class
*/
router.get("/teacher-class/:classId", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can access this" });
    }

    if (!isValidObjectId(req.params.classId)) {
      return res.status(400).json({ message: "Valid class ID is required" });
    }

    const classData = await Class.findById(req.params.classId);
    if (!classData || classData.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this class" });
    }

    const exams = await Exam.find({ class: req.params.classId }).select("title duration createdAt questions");
    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   POST /api/exams/submit/:id
   @desc    Student submits exam answers
*/
router.post("/submit/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit exams" });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Valid exam ID is required" });
    }

    const exam = await Exam.findById(req.params.id).populate('class');
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Verify student is enrolled in the class containing this exam
    const isEnrolled = exam.class.students.some(studentId => studentId.toString() === req.user._id.toString());
    if (!isEnrolled) {
      return res.status(403).json({ message: "Not enrolled in this class" });
    }

    const existingResult = await Result.findOne({
      exam: req.params.id,
      student: req.user._id,
    });

    if (existingResult) {
      return res.status(400).json({ message: "You have already attempted this exam" });
    }

    const { answers } = req.body;

    // Validate answers input
    if (!Array.isArray(answers)) {
      return res.status(400).json({ message: "Answers must be an array" });
    }

    if (answers.length !== exam.questions.length) {
      return res.status(400).json({ message: "Number of answers must match number of questions" });
    }

    let score = 0;
    let totalMarks = 0;
    let requiresManualReview = false;

    const answerDetails = exam.questions.map((question, index) => {
      const submittedAnswer = normalizeString(answers[index]);
      const maxMarks = question.maxMarks || 1;
      totalMarks += maxMarks;

      if (question.type === "theory") {
        requiresManualReview = true;
        return {
          questionIndex: index,
          questionText: question.questionText,
          type: question.type,
          answer: submittedAnswer,
          correctAnswer: "",
          isCorrect: null,
          maxMarks,
          awardedMarks: 0,
          reviewed: false,
          feedback: "",
        };
      }

      const isCorrect = submittedAnswer === question.correctAnswer;
      const awardedMarks = isCorrect ? maxMarks : 0;
      score += awardedMarks;

      return {
        questionIndex: index,
        questionText: question.questionText,
        type: question.type,
        answer: submittedAnswer,
        correctAnswer: question.correctAnswer,
        isCorrect,
        maxMarks,
        awardedMarks,
        reviewed: true,
        feedback: "",
      };
    });

    await Result.create({
      exam: exam._id,
      student: req.user._id,
      score,
      totalQuestions: exam.questions.length,
      totalMarks,
      answers: answerDetails,
      reviewStatus: requiresManualReview ? "pending_review" : "completed",
    });

    res.json({
      message: "Exam submitted successfully",
      score,
      totalQuestions: exam.questions.length,
      totalMarks,
      reviewStatus: requiresManualReview ? "pending_review" : "completed",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/exams/results/:examId
   @desc    Teacher views full attempt status of students
*/
router.get("/results/:examId", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can view results" });
    }

    if (!isValidObjectId(req.params.examId)) {
      return res.status(400).json({ message: "Valid exam ID is required" });
    }

    const exam = await Exam.findById(req.params.examId).populate("class");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.class.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const classData = await Class.findById(exam.class._id).populate("students", "name email");
    const results = await Result.find({ exam: exam._id });

    const resultMap = {};
    results.forEach((r) => {
      resultMap[r.student.toString()] = r;
    });

    const dashboard = classData.students.map((student) => {
      const r = resultMap[student._id.toString()];
      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        attempted: !!r,
        score: r ? r.score : null,
        totalQuestions: r ? r.totalQuestions : null,
        totalMarks: r ? r.totalMarks : null,
        reviewStatus: r ? r.reviewStatus : null,
      };
    });

    res.json(dashboard);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/submission/:examId/:studentId", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can view submissions" });
    }

    if (!isValidObjectId(req.params.examId) || !isValidObjectId(req.params.studentId)) {
      return res.status(400).json({ message: "Valid IDs are required" });
    }

    const exam = await Exam.findById(req.params.examId).populate("class");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.class.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await Result.findOne({
      exam: req.params.examId,
      student: req.params.studentId,
    }).populate("student", "name email");

    if (!result) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.put("/submission/:examId/:studentId/grade", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can grade submissions" });
    }

    if (!isValidObjectId(req.params.examId) || !isValidObjectId(req.params.studentId)) {
      return res.status(400).json({ message: "Valid IDs are required" });
    }

    const exam = await Exam.findById(req.params.examId).populate("class");
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    if (exam.class.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    const result = await Result.findOne({
      exam: req.params.examId,
      student: req.params.studentId,
    });

    if (!result) {
      return res.status(404).json({ message: "Submission not found" });
    }

    const grades = Array.isArray(req.body.grades) ? req.body.grades : null;
    if (!grades) {
      return res.status(400).json({ message: "Grades must be an array" });
    }

    const gradeMap = new Map();
    for (const grade of grades) {
      const questionIndex = Number(grade?.questionIndex);
      const awardedMarks = Number(grade?.awardedMarks);
      const feedback = normalizeString(grade?.feedback);

      if (!Number.isInteger(questionIndex) || questionIndex < 0) {
        return res.status(400).json({ message: "Each grade must have a valid question index" });
      }

      if (gradeMap.has(questionIndex)) {
        return res.status(400).json({ message: "Duplicate grades are not allowed" });
      }

      gradeMap.set(questionIndex, { awardedMarks, feedback });
    }

    let recalculatedScore = 0;
    let pendingReview = false;

    result.answers = result.answers.map((answer) => {
      if (answer.type === "theory") {
        const update = gradeMap.get(answer.questionIndex);

        if (update) {
          if (!Number.isFinite(update.awardedMarks) || update.awardedMarks < 0 || update.awardedMarks > answer.maxMarks) {
            throw new Error(`Invalid marks for question ${answer.questionIndex + 1}`);
          }

          answer.awardedMarks = update.awardedMarks;
          answer.reviewed = true;
          answer.feedback = update.feedback;
        }

        if (!Number.isFinite(answer.awardedMarks) || answer.awardedMarks < 0 || answer.awardedMarks > answer.maxMarks) {
          throw new Error(`Invalid marks for question ${answer.questionIndex + 1}`);
        }
      }

      if (answer.type === "theory" && !answer.reviewed) {
        pendingReview = true;
      }

      recalculatedScore += answer.awardedMarks || 0;
      return answer;
    });

    result.score = recalculatedScore;
    result.reviewStatus = pendingReview ? "pending_review" : "completed";
    await result.save();

    res.json({
      message: "Submission graded successfully",
      score: result.score,
      totalMarks: result.totalMarks,
      reviewStatus: result.reviewStatus,
    });
  } catch (error) {
    if (error.message.startsWith("Invalid marks")) {
      return res.status(400).json({ message: error.message });
    }

    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/exams/:id
   @desc    Student fetches full exam (without answers) — MUST be last
*/
router.get("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can access exam" });
    }

    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: "Valid exam ID is required" });
    }

    const exam = await Exam.findById(req.params.id).populate('class');
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Verify student is enrolled in the class containing this exam
    const isEnrolled = exam.class.students.some(studentId => studentId.toString() === req.user._id.toString());
    if (!isEnrolled) {
      return res.status(403).json({ message: "Not enrolled in this class" });
    }

    // Remove correct answers before sending to student
    const examForStudent = exam.toObject();
    examForStudent.questions = exam.questions.map(q => ({
      type: q.type,
      questionText: q.questionText,
      options: q.options,
      maxMarks: q.maxMarks,
    }));

    res.json(examForStudent);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
