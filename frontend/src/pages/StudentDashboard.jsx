import { useEffect, useRef, useState } from "react";
import API from "../api";
import DashboardLayout from "../components/DashboardLayout";
import StudentClassesPanel from "../components/dashboard/student/StudentClassesPanel";
import StudentExamRunner from "../components/dashboard/student/StudentExamRunner";
import StudentExamsPanel from "../components/dashboard/student/StudentExamsPanel";
import StudentResultsPanel from "../components/dashboard/student/StudentResultsPanel";
import StudentSubmissionBanner from "../components/dashboard/student/StudentSubmissionBanner";

export default function StudentDashboard() {
  const [joinCode, setJoinCode] = useState("");
  const [classes, setClasses] = useState([]);
  const [exams, setExams] = useState([]);
  const [resultsHistory, setResultsHistory] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [recentSubmission, setRecentSubmission] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeClassId, setActiveClassId] = useState(null);
  const [joinMsg, setJoinMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("classes");
  const [submitError, setSubmitError] = useState(null);
  const submitCalledRef = useRef(false);
  const selectedExamRef = useRef(null);
  const answersRef = useRef({});

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes/my-classes");
      setClasses(res.data);
    } catch {
      // Error handled silently - user will see empty class list
    }
  };

  const [refreshing, setRefreshing] = useState(false);

  const fetchResultsHistory = async () => {
    setRefreshing(true);
    try {
      const res = await API.get("/exams/my-results");
      setResultsHistory(res.data);
    } catch {
      // Error handled silently - user will see empty results list
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchResultsHistory();
  }, []);

  useEffect(() => {
    selectedExamRef.current = selectedExam;
  }, [selectedExam]);

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  const handleSubmitExam = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const exam = selectedExamRef.current;
      const examId = exam?._id;

      if (!examId) {
        setIsSubmitting(false);
        return;
      }

      const currentAnswers = answersRef.current;
      const answersArray = exam.questions.map((_, index) => currentAnswers[index] || "");

      const res = await API.post(`/exams/submit/${examId}`, { answers: answersArray });
      setRecentSubmission({
        examTitle: exam.title,
        score: res.data.score,
        totalMarks: res.data.totalMarks,
        reviewStatus: res.data.reviewStatus,
      });
      setSelectedExam(null);
      setTimeLeft(0);
      setExams((currentExams) =>
        currentExams.map((examItem) =>
          examItem._id === examId
            ? {
                ...examItem,
                attempted: true,
                reviewStatus: res.data.reviewStatus,
                score: res.data.score,
                totalMarks: res.data.totalMarks,
              }
            : examItem
        )
      );
      await fetchResultsHistory();
      setActiveTab("results");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Failed to submit exam. Please try again.";
      setSubmitError(errorMessage);
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (!selectedExam || isSubmitting) {
      return undefined;
    }

    submitCalledRef.current = false;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          if (!submitCalledRef.current) {
            submitCalledRef.current = true;
            handleSubmitExam();
          }
          return 0;
        }

        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedExam, isSubmitting]);

  const handleJoinClass = async () => {
    if (!joinCode.trim()) {
      return;
    }

    setJoinMsg(null);

    try {
      await API.post("/classes/join", { joinCode });
      setJoinMsg({ type: "success", text: "Join request sent. Waiting for teacher approval." });
      setJoinCode("");
    } catch (err) {
      setJoinMsg({ type: "error", text: err.response?.data?.message || "Error sending request" });
    }
  };

  const fetchExams = async (classId) => {
    try {
      const res = await API.get(`/exams/class/${classId}`);
      setExams(res.data);
      setActiveClassId(classId);
      setRecentSubmission(null);
      setActiveTab("exams");
      setSubmitError(null);
    } catch {
      // Error handled silently - user will see empty exam list
    }
  };

  const openExam = async (examId) => {
    try {
      const checkRes = await API.get(`/exams/check-attempt/${examId}`);
      if (checkRes.data.alreadyAttempted) {
        setSubmitError("You have already attempted this exam.");
        setExams((currentExams) =>
          currentExams.map((examItem) =>
            examItem._id === examId ? { ...examItem, attempted: true } : examItem
          )
        );
        return;
      }

      const res = await API.get(`/exams/${examId}`);
      setSelectedExam(res.data);
      setAnswers({});
      setRecentSubmission(null);
      setIsSubmitting(false);
      setSubmitError(null);
      submitCalledRef.current = false;
      setTimeLeft(res.data.duration * 60);
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Could not open exam. Please try again.";
      setSubmitError(errorMessage);
    }
  };

  const handleAnswerChange = (questionIndex, value) => {
    setAnswers((current) => ({
      ...current,
      [questionIndex]: value,
    }));
  };

  const handleTabChange = (tab) => {
    if (selectedExam) {
      return;
    }

    if (tab !== "results") {
      setRecentSubmission(null);
    }

    setActiveTab(tab);
  };

  const timerColor =
    timeLeft < 60 ? "text-[#a84f45]" : timeLeft < 300 ? "text-[#b07b2c]" : "text-[#2f6668]";

  const attemptedExams = exams.filter((exam) => exam.attempted);
  const pendingExams = exams.filter((exam) => !exam.attempted);

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <div className="mx-auto max-w-4xl p-8">
        <h1 className="mb-6 text-2xl font-bold text-[#183247]">Student Dashboard</h1>

        {recentSubmission && activeTab === "results" && (
          <StudentSubmissionBanner
            submission={recentSubmission}
            onDismiss={() => setRecentSubmission(null)}
          />
        )}

        {selectedExam ? (
          <StudentExamRunner
            exam={selectedExam}
            answers={answers}
            timeLeft={timeLeft}
            timerColor={timerColor}
            submitError={submitError}
            isSubmitting={isSubmitting}
            onAnswerChange={handleAnswerChange}
            onGoBack={() => {
              setSelectedExam(null);
              setSubmitError(null);
              setTimeLeft(0);
            }}
            onSubmit={handleSubmitExam}
          />
        ) : (
          <>
            {activeTab === "classes" && (
              <StudentClassesPanel
                joinCode={joinCode}
                joinMessage={joinMsg}
                classes={classes}
                onJoinCodeChange={setJoinCode}
                onJoinClass={handleJoinClass}
                onViewExams={fetchExams}
              />
            )}

            {activeTab === "exams" && (
              <StudentExamsPanel
                classes={classes}
                exams={exams}
                activeClassId={activeClassId}
                pendingExams={pendingExams}
                attemptedExams={attemptedExams}
                submitError={submitError}
                onSelectClass={fetchExams}
                onOpenExam={openExam}
              />
            )}

            {activeTab === "results" && (
              <StudentResultsPanel
                resultsHistory={resultsHistory}
                onRefresh={fetchResultsHistory}
                refreshing={refreshing}
              />
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
