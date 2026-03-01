import { useEffect, useState } from "react";
import API from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [requests, setRequests] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [questions, setQuestions] = useState([
    { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
  ]);

  // Fetch teacher classes
  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes/teacher-classes");
      setClasses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Fetch join requests
  const fetchRequests = async () => {
    try {
      const res = await API.get("/classes/requests");
      setRequests(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchRequests();
  }, []);

  // Create new class
  const handleCreateClass = async () => {
    if (!className) return;

    try {
      await API.post("/classes/create", { className });
      setClassName("");
      fetchClasses();
    } catch (err) {
      alert("Error creating class");
    }
  };

  // Approve student
  const handleApprove = async (id) => {
    try {
      await API.put(`/classes/approve/${id}`);
      fetchRequests();
      fetchClasses();
    } catch (err) {
      alert("Error approving");
    }
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
    ]);
  };

  const updateQuestionText = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].questionText = value;
    setQuestions(newQuestions);
  };

  const updateOption = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const updateCorrectAnswer = (index, value) => {
    const newQuestions = [...questions];
    newQuestions[index].correctAnswer = value;
    setQuestions(newQuestions);
  };

  const createExam = async () => {
    try {
      await API.post("/exams/create", {
        title: examTitle,
        classId: selectedClass,
        duration,
        questions
      });

      alert("Exam created successfully");

      setExamTitle("");
      setDuration("");
      setQuestions([
        { questionText: "", options: ["", "", "", ""], correctAnswer: "" }
      ]);

    } catch (err) {
      alert("Error creating exam");
    }
  };
  return (
    <DashboardLayout>

    <h2 className="text-2xl font-bold mb-6">Teacher Dashboard</h2>
    <div>
      <h2>Teacher Dashboard</h2>

      {/* Create Class */}
      <div>
        <h3>Create Class</h3>
        <input
          className="border p-2 rounded w-full mb-3"
          placeholder="Class Name"
          type="text"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleCreateClass}>Create</button>
      </div>

      {/* Class List */}
      <div className="grid grid-cols-3 gap-6">

  {classes.map((cls) => (

    <div
      key={cls._id}
      className="bg-white shadow-md rounded-lg p-6"
    >

      <h3 className="text-lg font-semibold">
        {cls.className}
      </h3>

      <p className="text-gray-600 mt-2">
        Join Code: {cls.joinCode}
      </p>

      <p className="text-sm mt-2">
        Students: {cls.students.length}
      </p>

      <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded">
        View Exams
      </button>

    </div>

  ))}

</div>

      {/* Join Requests */}
      <div>
        <h3>Pending Join Requests</h3>
        {requests.map((req) => (
          <div key={req._id} style={{ border: "1px solid gray", margin: 10 }}>
            <p>{req.student.name} ({req.student.email})</p>
            <button onClick={() => handleApprove(req._id)}>
              Approve
            </button>
          </div>
        ))}
      </div>
        <h3>Create Exam</h3>

          <select onChange={(e) => setSelectedClass(e.target.value)}>
            <option>Select Class</option>
            {classes.map((cls) => (
              <option key={cls._id} value={cls._id}>
                {cls.className}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Exam Title"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />

          {questions.map((q, qIndex) => (
            <div key={qIndex} style={{ border: "1px solid gray", margin: 10 }}>
              <input
                type="text"
                placeholder="Question"
                value={q.questionText}
                onChange={(e) => updateQuestionText(qIndex, e.target.value)}
              />

              {q.options.map((opt, oIndex) => (
                <input
                  key={oIndex}
                  type="text"
                  placeholder={`Option ${oIndex + 1}`}
                  value={opt}
                  onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                />
              ))}

              <input
                type="text"
                placeholder="Correct Answer"
                value={q.correctAnswer}
                onChange={(e) => updateCorrectAnswer(qIndex, e.target.value)}
              />
            </div>
          ))}

          <button onClick={addQuestion}>Add Question</button>

          <br />

        <button onClick={createExam}>Create Exam</button>
    </div>
    </DashboardLayout>
  );
}