import { useState } from "react";
import API from "../api";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", form);

      // Store token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.user.role);

      if (res.data.user.role === "teacher") {
        navigate("/teacher");
      } else {
        navigate("/student");
      }

    } catch (error) {
      alert(error.response?.data?.message || "Invalid credentials");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <input
        type="email"
        name="email"
        placeholder="Email"
        onChange={handleChange}
        required
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <button onClick={() => navigate("/register")}>Register</button>

      <button type="submit">Login</button>
    </form>
  );
}