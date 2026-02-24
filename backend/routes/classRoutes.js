const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Class = require("../models/Class");
const JoinRequest = require("../models/JoinRequest");

const router = express.Router();

/*
   @route   POST /api/classes/create
   @desc    Teacher creates a class
*/
router.post("/create", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create classes" });
    }

    const { className } = req.body;

    // Generate simple join code
    const joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newClass = await Class.create({
      className,
      teacher: req.user._id,
      joinCode,
    });

    res.status(201).json(newClass);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   POST /api/classes/join
   @desc    Student sends join request using join code
*/
router.post("/join", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can join classes" });
    }

    const { joinCode } = req.body;

    const classData = await Class.findOne({ joinCode });
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if already requested
    const existingRequest = await JoinRequest.findOne({
      class: classData._id,
      student: req.user._id,
    });

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" });
    }

    await JoinRequest.create({
      class: classData._id,
      student: req.user._id,
    });

    res.json({ message: "Join request sent" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/classes/requests
   @desc    Teacher views pending join requests
*/
router.get("/requests", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can view requests" });
    }

    const teacherClasses = await Class.find({ teacher: req.user._id });

    const classIds = teacherClasses.map(c => c._id);

    const requests = await JoinRequest.find({
      class: { $in: classIds },
      status: "pending",
    }).populate("student", "name email");

    res.json(requests);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   PUT /api/classes/approve/:id
   @desc    Teacher approves join request
*/
router.put("/approve/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can approve" });
    }

    const request = await JoinRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    request.status = "approved";
    await request.save();

    // Add student to class
    await Class.findByIdAndUpdate(request.class, {
      $addToSet: { students: request.student },
    });

    res.json({ message: "Student approved successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/classes/my-classes
   @desc    Student views approved classes
*/
router.get("/my-classes", protect, async (req, res) => {
  try {
    if (req.user.role !== "student") {
      return res.status(403).json({ message: "Only students can view their classes" });
    }

    const classes = await Class.find({
      students: req.user._id,
    }).populate("teacher", "name email");

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/*
   @route   GET /api/classes/teacher-classes
   @desc    Teacher views their created classes
*/
router.get("/teacher-classes", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can view their classes" });
    }

    const classes = await Class.find({
      teacher: req.user._id,
    }).populate("students", "name email");

    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
