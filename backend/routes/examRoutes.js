const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Exam = require("../models/Exam");
const Class = require("../models/Class");

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

    const { title, classId, duration, questions } = req.body;

    // Check if teacher owns this class
    const classData = await Class.findById(classId);
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    if (classData.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized for this class" });
    }

    const exam = await Exam.create({
      title,
      class: classId,
      duration,
      questions,
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
      return res.status(403).json({ message: "Only students can view exams" });
    }

    const exams = await Exam.find({
      class: req.params.classId,
    }).select("-questions.correctAnswer");

    res.json(exams);
  } catch (error) {
    res.status(500).json({ message: "Server error" });  
  }
});

/*
   @route   GET /api/exams/:id
   @desc    Student fetches full exam (without answers)
*/
router.get("/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can access exam" });
    }

    const exam = await Exam.findById(req.params.id)
      .select("-questions.correctAnswer");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    res.json(exam);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

const Result = require("../models/Result");

/*
   @route   POST /api/exams/submit/:id
   @desc    Student submits exam answers
*/
router.post("/submit/:id", protect, async (req, res) => {
  try {

    const existingResult = await Result.findOne({
    exam: req.params.id,
    student: req.user._id,
    });

    if (existingResult) {
      return res.status(400).json({ message: "You have already attempted this exam" });
    }

    
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can submit exams" });
    }

    const exam = await Exam.findById(req.params.id);
    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const { answers } = req.body;

    let score = 0;

    exam.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswer) {
        score++;
      }
    });

    const result = await Result.create({
      exam: exam._id,
      student: req.user._id,
      score,
      totalQuestions: exam.questions.length,
    });

    res.json({
      message: "Exam submitted successfully",
      score,
      totalQuestions: exam.questions.length,
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

    const exam = await Exam.findById(req.params.examId).populate("class");

    if (!exam) {
      return res.status(404).json({ message: "Exam not found" });
    }

    // Verify teacher owns this class
    if (exam.class.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Get all students of this class
    const classData = await Class.findById(exam.class._id)
      .populate("students", "name email");

    // Get all results for this exam
    const results = await Result.find({ exam: exam._id });

    // Map results for quick lookup
    const resultMap = {};
    results.forEach(result => {
      resultMap[result.student.toString()] = result;
    });

    // Build dashboard data
    const dashboard = classData.students.map(student => {
      const studentResult = resultMap[student._id.toString()];

      return {
        studentId: student._id,
        name: student.name,
        email: student.email,
        attempted: !!studentResult,
        score: studentResult ? studentResult.score : null,
        totalQuestions: studentResult ? studentResult.totalQuestions : null
      };
    });

    res.json(dashboard);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
