import { useEffect, useState } from "react";
import API from "../api";
import DashboardLayout from "../components/DashboardLayout";
import ToastMessage from "../components/dashboard/ToastMessage";
import TeacherClassesPanel from "../components/dashboard/teacher/TeacherClassesPanel";
import TeacherExamBuilder from "../components/dashboard/teacher/TeacherExamBuilder";
import TeacherOverview from "../components/dashboard/teacher/TeacherOverview";
import TeacherRequestsPanel from "../components/dashboard/teacher/TeacherRequestsPanel";
import TeacherResultsPanel from "../components/dashboard/teacher/TeacherResultsPanel";
import TeacherStudentsPanel from "../components/dashboard/teacher/TeacherStudentsPanel";

const createEmptyQuestion = () => ({
  type: "mcq",
  questionText: "",
  options: ["", "", "", ""],
  correctAnswer: "",
  maxMarks: 1,
});

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [requests, setRequests] = useState([]);
  const [examTitle, setExamTitle] = useState("");
  const [duration, setDuration] = useState("");
  const [selectedClass, setSelectedClass] = useState("");
  const [questions, setQuestions] = useState([createEmptyQuestion()]);
  const [activeTab, setActiveTab] = useState("classes");
  const [examResults, setExamResults] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [classExams, setClassExams] = useState([]);
  const [toast, setToast] = useState(null);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [gradeDrafts, setGradeDrafts] = useState({});
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [savingGrades, setSavingGrades] = useState(false);

  const totalStudents = classes.reduce((sum, cls) => sum + cls.students.length, 0);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchClasses = async () => {
    try {
      const res = await API.get("/classes/teacher-classes");
      setClasses(res.data);
    } catch {
      showToast("Error loading classes", "error");
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await API.get("/classes/requests");
      setRequests(res.data);
    } catch {
      showToast("Error loading requests", "error");
    }
  };

  useEffect(() => {
    fetchClasses();
    fetchRequests();
  }, []);

  const handleCreateClass = async () => {
    if (!className.trim()) {
      return;
    }

    try {
      await API.post("/classes/create", { className });
      setClassName("");
      fetchClasses();
      showToast("Class created successfully");
    } catch {
      showToast("Error creating class", "error");
    }
  };

  const handleApprove = async (id) => {
    try {
      await API.put(`/classes/approve/${id}`);
      fetchRequests();
      fetchClasses();
      showToast("Student approved");
    } catch {
      showToast("Error approving request", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await API.put(`/classes/reject/${id}`);
      fetchRequests();
      showToast("Request rejected");
    } catch {
      showToast("Error rejecting request", "error");
    }
  };

  const addQuestion = () => {
    setQuestions((current) => [...current, createEmptyQuestion()]);
  };

  const removeQuestion = (index) => {
    setQuestions((current) => current.filter((_, currentIndex) => currentIndex !== index));
  };

  const updateQuestion = (index, field, value) => {
    setQuestions((current) =>
      current.map((question, questionIndex) => {
        if (questionIndex !== index) {
          return question;
        }

        const nextQuestion = {
          ...question,
          [field]: value,
        };

        if (field === "type" && value === "theory") {
          nextQuestion.options = ["", "", "", ""];
          nextQuestion.correctAnswer = "";
        }

        return nextQuestion;
      })
    );
  };

  const updateOption = (questionIndex, optionIndex, value) => {
    setQuestions((current) =>
      current.map((question, currentIndex) => {
        if (currentIndex !== questionIndex) {
          return question;
        }

        return {
          ...question,
          options: question.options.map((option, currentOptionIndex) =>
            currentOptionIndex === optionIndex ? value : option
          ),
        };
      })
    );
  };

  const createExam = async () => {
    if (!examTitle || !selectedClass || !duration) {
      showToast("Please fill all exam details", "error");
      return;
    }

    try {
      await API.post("/exams/create", {
        title: examTitle,
        classId: selectedClass,
        duration,
        questions,
      });
      showToast("Exam created successfully");
      setExamTitle("");
      setDuration("");
      setSelectedClass("");
      setQuestions([createEmptyQuestion()]);
    } catch (error) {
      showToast(error.response?.data?.message || "Error creating exam", "error");
    }
  };

  const fetchClassExams = async (classId) => {
    try {
      const res = await API.get(`/exams/teacher-class/${classId}`);
      setClassExams(res.data);
      setExamResults([]);
      setSelectedExamId("");
      setSelectedSubmission(null);
      setGradeDrafts({});
    } catch {
      showToast("Error loading exams", "error");
    }
  };

  const fetchResults = async (examId) => {
    try {
      const res = await API.get(`/exams/results/${examId}`);
      setExamResults(res.data);
      setSelectedExamId(examId);
      setSelectedSubmission(null);
      setGradeDrafts({});
    } catch {
      showToast("Error fetching results", "error");
    }
  };

  const fetchSubmission = async (studentId) => {
    if (!selectedExamId) {
      return;
    }

    try {
      setLoadingSubmission(true);
      const res = await API.get(`/exams/submission/${selectedExamId}/${studentId}`);
      setSelectedSubmission(res.data);

      const initialDrafts = {};
      res.data.answers
        .filter((answer) => answer.type === "theory")
        .forEach((answer) => {
          initialDrafts[answer.questionIndex] = {
            awardedMarks: answer.awardedMarks ?? 0,
            feedback: answer.feedback || "",
          };
        });
      setGradeDrafts(initialDrafts);
    } catch (error) {
      showToast(error.response?.data?.message || "Error loading submission", "error");
    } finally {
      setLoadingSubmission(false);
    }
  };

  const saveGrades = async () => {
    if (!selectedSubmission) {
      return;
    }

    try {
      setSavingGrades(true);
      const grades = selectedSubmission.answers
        .filter((answer) => answer.type === "theory")
        .map((answer) => ({
          questionIndex: answer.questionIndex,
          awardedMarks: Number(gradeDrafts[answer.questionIndex]?.awardedMarks ?? 0),
          feedback: gradeDrafts[answer.questionIndex]?.feedback || "",
        }));

      await API.put(
        `/exams/submission/${selectedSubmission.exam}/${selectedSubmission.student._id}/grade`,
        { grades }
      );

      await fetchResults(selectedSubmission.exam);
      await fetchSubmission(selectedSubmission.student._id);
      showToast("Submission graded successfully");
    } catch (error) {
      showToast(error.response?.data?.message || "Error saving grades", "error");
    } finally {
      setSavingGrades(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "results" && classExams.length === 0 && classes.length > 0) {
      fetchClassExams(classes[0]._id);
    }
  };

  const handleCopyJoinCode = async (joinCode) => {
    await navigator.clipboard.writeText(joinCode);
    showToast("Join code copied");
  };

  const updateGradeDraft = (questionIndex, nextDraft) => {
    setGradeDrafts((current) => ({
      ...current,
      [questionIndex]: nextDraft,
    }));
  };

  return (
    <DashboardLayout activeTab={activeTab} onTabChange={handleTabChange}>
      <ToastMessage toast={toast} />

      <div className="min-h-screen px-8 py-8">
        <div className="mx-auto max-w-6xl">
          <TeacherOverview
            classesCount={classes.length}
            totalStudents={totalStudents}
            requestsCount={requests.length}
          />

          {activeTab === "classes" && (
            <TeacherClassesPanel
              classes={classes}
              className={className}
              onClassNameChange={setClassName}
              onCreateClass={handleCreateClass}
              onShowResults={(classId) => {
                fetchClassExams(classId);
                handleTabChange("results");
              }}
              onCopyJoinCode={handleCopyJoinCode}
            />
          )}

          {activeTab === "students" && (
            <TeacherStudentsPanel classes={classes} totalStudents={totalStudents} />
          )}

          {activeTab === "requests" && (
            <TeacherRequestsPanel
              requests={requests}
              onApprove={handleApprove}
              onReject={handleReject}
            />
          )}

          {activeTab === "create-exam" && (
            <TeacherExamBuilder
              classes={classes}
              selectedClass={selectedClass}
              examTitle={examTitle}
              duration={duration}
              questions={questions}
              onSelectedClassChange={setSelectedClass}
              onExamTitleChange={setExamTitle}
              onDurationChange={setDuration}
              onQuestionChange={updateQuestion}
              onOptionChange={updateOption}
              onAddQuestion={addQuestion}
              onRemoveQuestion={removeQuestion}
              onCreateExam={createExam}
            />
          )}

          {activeTab === "results" && (
            <TeacherResultsPanel
              classes={classes}
              classExams={classExams}
              examResults={examResults}
              selectedExamId={selectedExamId}
              selectedSubmission={selectedSubmission}
              loadingSubmission={loadingSubmission}
              gradeDrafts={gradeDrafts}
              savingGrades={savingGrades}
              onSelectClass={fetchClassExams}
              onSelectExam={fetchResults}
              onReviewSubmission={fetchSubmission}
              onGradeDraftChange={updateGradeDraft}
              onSaveGrades={saveGrades}
            />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
