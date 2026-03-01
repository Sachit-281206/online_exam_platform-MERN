import { Link } from "react-router-dom";

export default function DashboardLayout({ children }) {
  const role = localStorage.getItem("role");

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white p-6">

        <h2 className="text-2xl font-bold mb-8">Online Exam</h2>

        {role === "teacher" && (
          <>
            <Link className="block mb-4 hover:text-gray-200" to="/teacher">
              Classes
            </Link>
            <Link className="block mb-4 hover:text-gray-200" to="/teacher">
              Create Exam
            </Link>
            <Link className="block mb-4 hover:text-gray-200" to="/teacher">
              Results
            </Link>
          </>
        )}

        {role === "student" && (
          <>
            <Link className="block mb-4 hover:text-gray-200" to="/student">
              My Classes
            </Link>
            <Link className="block mb-4 hover:text-gray-200" to="/student">
              Exams
            </Link>
          </>
        )}

        <button
          className="mt-10 bg-red-500 px-4 py-2 rounded hover:bg-red-600"
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
        >
          Logout
        </button>

      </div>

      {/* Content */}
      <div className="flex-1 p-10">{children}</div>

    </div>
  );
}