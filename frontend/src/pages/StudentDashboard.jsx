import { useEffect, useState } from "react";
import API from "../api";

export default function StudentDashboard() {
  const [joinCode, setJoinCode] = useState("");
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);

  // Fetch joined classes
  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes/my-classes");
      setClasses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Join class
  const handleJoinClass = async () => {
    try {
      await API.post("/classes/join", { joinCode });
      alert("Join request sent");
      setJoinCode("");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  // Fetch exams of class
  const fetchExams = async (classId) => {
    try {
      const res = await API.get(`/exams/class/${classId}`);
      setExams(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // Open exam
  const openExam = async (examId) => {
    try {
      const res = await API.get(`/exams/${examId}`);
      setSelectedExam(res.data);
      setAnswers({});
      setResult(null);
    } catch (err) {
      console.log(err);
    }
  };

  // Submit exam
  const submitExam = async () => {
    try {
      const res = await API.post(`/exams/submit/${selectedExam._id}`, {
        answers,
      });
      setResult(res.data);
      setSelectedExam(null);
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div>
      <h2>Student Dashboard</h2>

      {/* Join Class */}
      <div>
        <h3>Join Class</h3>
        <input
          type="text"
          placeholder="Enter Join Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />
        <button onClick={handleJoinClass}>Join</button>
      </div>

      {/* Joined Classes */}
      <div>
        <h3>Your Classes</h3>
        {classes.map((cls) => (
          <div key={cls._id} style={{ border: "1px solid black", margin: 10 }}>
            <p><strong>{cls.className}</strong></p>
            <button onClick={() => fetchExams(cls._id)}>
              View Exams
            </button>
          </div>
        ))}
      </div>

      {/* Exams */}
      <div>
        <h3>Exams</h3>
        {exams.map((exam) => (
          <div key={exam._id} style={{ border: "1px solid gray", margin: 10 }}>
            <p>{exam.title}</p>
            <p>Duration: {exam.duration} mins</p>
            <button onClick={() => openExam(exam._id)}>
              Attempt
            </button>
          </div>
        ))}
      </div>

      {/* Exam Attempt */}
      {selectedExam && (
        <div>
          <h3>{selectedExam.title}</h3>

          {selectedExam.questions.map((q, index) => (
            <div key={index}>
              <p>{q.questionText}</p>
              {q.options.map((opt, i) => (
                <div key={i}>
                  <input
                    type="radio"
                    name={`question-${index}`}
                    value={opt}
                    onChange={() =>
                      setAnswers({ ...answers, [index]: opt })
                    }
                  />
                  {opt}
                </div>
              ))}
            </div>
          ))}

          <button onClick={submitExam}>Submit Exam</button>
        </div>
      )}

      {/* Result */}
      {result && (
        <div>
          <h3>Result</h3>
          <p>
            Score: {result.score} / {result.totalQuestions}
          </p>
        </div>
      )}
    </div>
  );
}