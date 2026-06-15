const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const Class = require("../models/Class");
const JoinRequest = require("../models/JoinRequest");
const { isNonEmptyString, normalizeString } = require("../utils/validation");

const router = express.Router();

const generateJoinCode = async () => {
  let joinCode;
  let exists = true;

  while (exists) {
    joinCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    exists = await Class.exists({ joinCode });
  }

  return joinCode;
};

/*
   @route   POST /api/classes/create
   @desc    Teacher creates a class
*/
router.post("/create", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can create classes" });
    }

    const className = normalizeString(req.body.className);

    if (!isNonEmptyString(className)) {
      return res.status(400).json({ message: "Class name is required" });
    }

    // Generate simple join code
    const joinCode = await generateJoinCode();

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

    const joinCode = normalizeString(req.body.joinCode).toUpperCase();

    if (!isNonEmptyString(joinCode)) {
      return res.status(400).json({ message: "Join code is required" });
    }

    const classData = await Class.findOne({ joinCode });
    if (!classData) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if already a member
    if (classData.students.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already enrolled in this class" });
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
    }).populate("student", "name email").populate("class", "className");

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

    const request = await JoinRequest.findById(req.params.id).populate("class");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!request.class || request.class.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to approve this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request has already been processed" });
    }

    request.status = "approved";
    await request.save();

    // Add student to class
    await Class.findByIdAndUpdate(request.class._id, {
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

/*
   @route   PUT /api/classes/reject/:id
   @desc    Teacher rejects join request
*/
router.put("/reject/:id", protect, async (req, res) => {
  try {
    if (req.user.role !== "teacher") {
      return res.status(403).json({ message: "Only teachers can reject requests" });
    }

    const request = await JoinRequest.findById(req.params.id).populate("class");
    if (!request) {
      return res.status(404).json({ message: "Request not found" });
    }

    if (!request.class || request.class.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to reject this request" });
    }

    if (request.status !== "pending") {
      return res.status(400).json({ message: "This request has already been processed" });
    }

    request.status = "rejected";
    await request.save();

    res.json({ message: "Request rejected" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
