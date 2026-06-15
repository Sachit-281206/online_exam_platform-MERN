import { useState } from "react";
import API from "../api";
import { useNavigate, Link } from "react-router-dom";

function BrandMark() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3e647c] bg-[radial-gradient(circle_at_top,_#3f708e_0%,_#294f67_58%,_#183247_100%)] shadow-lg shadow-[#102737]/30">
      <div className="absolute inset-1 rounded-[14px] border border-white/10" />
      <div className="absolute h-7 w-7 rounded-full border border-[#d9ebe9]/70" />
      <div className="absolute h-3 w-3 rounded-full bg-[#d9ebe9] shadow-[0_0_16px_rgba(217,235,233,0.55)]" />
      <div className="absolute h-8 w-1 rotate-45 rounded-full bg-[#d7c7a6]/80" />
    </div>
  );
}

function EyeIcon({ open }) {
  return open ? (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-6.5 0-10-8-10-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c6.5 0 10 8 10 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
      <line x1="2" y1="2" x2="22" y2="22" />
    </svg>
  );
}

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "student" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await API.post("/auth/register", form);
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
      setShake(true);
      setTimeout(() => setShake(false), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f2ede3_0%,#f8f5ee_42%,#e8eef2_100%)] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-3xl shadow-2xl shadow-[#102737]/20 flex">

        {/* Left Panel */}
        <div className="hidden md:flex md:w-1/2 flex-col justify-between bg-[#102737] px-10 py-12">
          <div className="flex items-center gap-3">
            <BrandMark />
            <span className="text-lg font-semibold text-white">Exam Sphere</span>
          </div>

          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Your online<br />exam workspace
            </h2>
          </div>

          <p className="text-xs text-[#5d7a8a]">© {new Date().getFullYear()} Exam Sphere</p>
        </div>

        {/* Right Panel */}
        <div className="w-full md:w-1/2 bg-[#fffaf0] px-8 py-12 flex flex-col justify-center">
          <div className="mb-8 flex flex-col items-center md:items-start">
            <div className="flex md:hidden mb-4">
              <BrandMark />
            </div>
            <h1 className="text-2xl font-bold text-[#183247]">Create account</h1>
            <p className="mt-1 text-sm text-[#5d6d78]">Sign up to get started</p>
          </div>

          {error && (
            <div className={`mb-4 rounded-xl border border-[#e8c5c0] bg-[#fdf0ee] px-4 py-3 text-sm text-[#a84f45] ${shake ? "animate-[shake_0.4s_ease]" : ""}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-[#183247]">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#c8d1d8] bg-white px-4 py-2.5 text-sm text-[#183247] placeholder-[#9eb2bf] focus:border-[#2f6668] focus:outline-none focus:ring-2 focus:ring-[#2f6668]/20 transition"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#183247]">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-[#c8d1d8] bg-white px-4 py-2.5 text-sm text-[#183247] placeholder-[#9eb2bf] focus:border-[#2f6668] focus:outline-none focus:ring-2 focus:ring-[#2f6668]/20 transition"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#183247]">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 6 characters"
                  onChange={handleChange}
                  required
                  minLength={6}
                  className="w-full rounded-xl border border-[#c8d1d8] bg-white px-4 py-2.5 pr-10 text-sm text-[#183247] placeholder-[#9eb2bf] focus:border-[#2f6668] focus:outline-none focus:ring-2 focus:ring-[#2f6668]/20 transition"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9eb2bf] hover:text-[#2f6668] transition"
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-[#183247]">Role</label>
              <select
                name="role"
                onChange={handleChange}
                value={form.role}
                className="w-full rounded-xl border border-[#c8d1d8] bg-white px-4 py-2.5 text-sm text-[#183247] focus:border-[#2f6668] focus:outline-none focus:ring-2 focus:ring-[#2f6668]/20 transition"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-[#294f67] to-[#2f6668] py-2.5 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                    <path d="M21 3v5h-5" />
                  </svg>
                  Creating account…
                </span>
              ) : "Register"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[#5d6d78]">
            Already have an account?{" "}
            <Link to="/" className="font-medium text-[#2f6668] hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-6px); }
          40% { transform: translateX(6px); }
          60% { transform: translateX(-4px); }
          80% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
