import { useEffect, useState } from "react";
import API from "../api";

export default function TeacherDashboard() {
  const [classes, setClasses] = useState([]);
  const [className, setClassName] = useState("");
  const [requests, setRequests] = useState([]);

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

  return (
    <div>
      <h2>Teacher Dashboard</h2>

      {/* Create Class */}
      <div>
        <h3>Create Class</h3>
        <input
          type="text"
          placeholder="Class Name"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <button onClick={handleCreateClass}>Create</button>
      </div>

      {/* Class List */}
      <div>
        <h3>Your Classes</h3>
        {classes.map((cls) => (
          <div key={cls._id} style={{ border: "1px solid black", margin: 10 }}>
            <p><strong>{cls.className}</strong></p>
            <p>Join Code: {cls.joinCode}</p>
            <p>Students: {cls.students.length}</p>
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
    </div>
  );
}