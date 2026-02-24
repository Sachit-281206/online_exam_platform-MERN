import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
// import AttemptExam from "./pages/AttemptExam";
// import Result from "./pages/Result";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        {/* <Route path="/exam" element={<AttemptExam />} /> */}
        {/* <Route path="/result" element={<Result />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
