import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import Register from "./pages/Register";
// import AttemptExam from "./pages/AttemptExam";
// import Result from "./pages/Result";

function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register/>} />
        <Route path="/student" element={<StudentDashboard />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        {/* <Route path="/exam" element={<AttemptExam />} /> */}
        {/* <Route path="/result" element={<Result />} /> */}
      </Routes>
    </BrowserRouter>
    
    <h1 className="text-4xl font-bold text-blue-600 text-center">
  Tailwind Working 🚀
</h1>
</>
  );
}

export default App;
