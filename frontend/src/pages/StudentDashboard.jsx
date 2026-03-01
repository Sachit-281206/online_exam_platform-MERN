import { useEffect, useState } from "react";
import API from "../api";
import DashboardLayout from "../components/DashboardLayout";

export default function StudentDashboard() {

  const [joinCode, setJoinCode] = useState("");
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

  // Timer logic
useEffect(() => {

  if (!selectedExam || isSubmitting) return;

  const timer = setInterval(() => {

    setTimeLeft(prev => {

      if (prev <= 1) {
        clearInterval(timer);
        submitExam();
        return 0;
      }

      return prev - 1;

    });

  }, 1000);

  return () => clearInterval(timer);

}, [selectedExam]);

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
      setTimeLeft(res.data.duration * 60);

    } catch (err) {
      console.log(err);
    }
  };

  // Submit exam
 const submitExam = async () => {

  if (!selectedExam || isSubmitting) return;

  setIsSubmitting(true);

  try {

    const res = await API.post(`/exams/submit/${selectedExam._id}`, {
      answers,
    });

    setResult(res.data);

    setSelectedExam(null);
    setTimeLeft(0);

  } catch (err) {
    console.log(err);
  }

};

  return (
    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">Student Dashboard</h2>

      {/* Join Class */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-2">Join Class</h3>

        <input
          className="border p-2 rounded mr-2"
          type="text"
          placeholder="Enter Join Code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={handleJoinClass}
        >
          Join
        </button>
      </div>

      {/* Joined Classes */}
      <div className="mb-6">

        <h3 className="text-lg font-semibold mb-2">Your Classes</h3>

        {classes.map((cls) => (

          <div
            key={cls._id}
            className="bg-white p-4 rounded shadow mb-3"
          >

            <p className="font-semibold">{cls.className}</p>

            <button
              className="bg-blue-500 text-white px-3 py-1 rounded mt-2"
              onClick={() => fetchExams(cls._id)}
            >
              View Exams
            </button>

          </div>

        ))}
      </div>

      {/* Exams */}
      <div className="mb-6">

        <h3 className="text-lg font-semibold mb-2">Exams</h3>

        {exams.map((exam) => (

          <div
            key={exam._id}
            className="bg-white p-4 rounded shadow mb-3"
          >

            <p className="font-semibold">{exam.title}</p>
            <p>Duration: {exam.duration} mins</p>

            <button
              className="bg-green-600 text-white px-3 py-1 rounded mt-2"
              onClick={() => openExam(exam._id)}
            >
              Attempt
            </button>

          </div>

        ))}
      </div>

      {/* Exam Attempt */}
      {selectedExam && (

        <div className="bg-white p-6 rounded shadow">

          <h2 className="text-xl font-bold mb-4">
            {selectedExam.title}
          </h2>

          {/* Timer */}
          <div className="text-right text-red-600 font-bold mb-4">
            Time Left: {Math.floor(timeLeft / 60)}:
            {String(timeLeft % 60).padStart(2, "0")}
          </div>

          {selectedExam.questions.map((q, index) => (

            <div key={index} className="mb-6 border-b pb-4">

              <p className="font-semibold">
                {index + 1}. {q.questionText}
              </p>

              <div className="mt-2 space-y-2">

                {q.options.map((opt, i) => (

                  <label key={i} className="block">

                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={opt}
                      className="mr-2"
                      onChange={() =>
                        setAnswers({ ...answers, [index]: opt })
                      }
                    />

                    {opt}

                  </label>

                ))}

              </div>

            </div>

          ))}

          <button
  className="bg-green-600 text-white px-6 py-2 rounded"
  disabled={isSubmitting || !selectedExam}
  onClick={submitExam}
>
  {isSubmitting ? "Submitting..." : "Submit Exam"}
</button>

        </div>
  
      )}

      {/* Result */}
      {result && (

        <div className="bg-white p-6 rounded shadow mt-6">

          <h3 className="text-lg font-bold">Result</h3>

          <p>
            Score: {result.score} / {result.totalQuestions}
          </p>

        </div>

      )}

    </DashboardLayout>
  );
}