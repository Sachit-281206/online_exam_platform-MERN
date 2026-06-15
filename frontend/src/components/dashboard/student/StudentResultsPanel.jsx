import { useState } from "react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import EmptyState from "../EmptyState";
import StatusBadge from "../StatusBadge";

function StatCard({ label, value, bg }) {
  return (
    <div className={`rounded-2xl ${bg} px-5 py-4`}>
      <p className="text-xs font-medium uppercase tracking-wide text-[#6d756d]">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[#183247]">{value}</p>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-[#d9d3c7] bg-[#fffaf0] px-3 py-2 text-sm shadow-md">
        <p className="font-semibold text-[#183247]">{label}</p>
        <p className="text-[#2f6668]">Score: {payload[0].value}%</p>
      </div>
    );
  }
  return null;
}

export default function StudentResultsPanel({ resultsHistory, onRefresh, refreshing }) {
  const [selectedClass, setSelectedClass] = useState("all");

  const classNames = ["all", ...new Set(resultsHistory.map((r) => r.className).filter(Boolean))];

  const filtered = selectedClass === "all"
    ? resultsHistory
    : resultsHistory.filter((r) => r.className === selectedClass);

  const reviewed = filtered.filter((r) => r.reviewStatus !== "pending_review");
  const totalExams = filtered.length;
  const avgScore =
    reviewed.length > 0
      ? Math.round(reviewed.reduce((sum, r) => sum + (r.totalMarks > 0 ? (r.score / r.totalMarks) * 100 : 0), 0) / reviewed.length)
      : 0;
  const passed = reviewed.filter((r) => r.totalMarks > 0 && (r.score / r.totalMarks) * 100 >= 50).length;
  const failed = reviewed.length - passed;

  const chartData = [...filtered]
    .filter((r) => r.reviewStatus !== "pending_review")
    .sort((a, b) => new Date(a.submittedAt) - new Date(b.submittedAt))
    .map((r) => ({
      name: r.examTitle.length > 12 ? r.examTitle.slice(0, 12) + "…" : r.examTitle,
      score: r.totalMarks > 0 ? Math.round((r.score / r.totalMarks) * 100) : 0,
    }));

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="text-base font-semibold text-[#183247]">Results</h2>
        <div className="flex items-center gap-2">
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="rounded-lg border border-[#c8d1d8] bg-[#fffdf8] px-3 py-2 text-sm font-medium text-[#4e6676] transition hover:bg-[#edf4f8] focus:outline-none"
          >
            {classNames.map((cls) => (
              <option key={cls} value={cls}>
                {cls === "all" ? "All Classes" : cls}
              </option>
            ))}
          </select>
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 rounded-lg border border-[#c8d1d8] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#4e6676] transition hover:bg-[#edf4f8] disabled:opacity-60"
          >
            <svg
              className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"
            >
              <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
              <path d="M21 3v5h-5" />
            </svg>
            {refreshing ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          message={
            <>
              <p className="text-sm font-medium text-[#183247]">No results yet</p>
              <p className="mt-1 text-sm text-[#5d6d78]">Submitted exams will appear here.</p>
            </>
          }
          className="text-center shadow-sm"
        />
      ) : (
        <div className="space-y-6">
          {/* Stat Cards */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard label="Total Exams" value={totalExams} bg="bg-[#edf4f8]" />
            <StatCard label="Avg Score" value={reviewed.length > 0 ? `${avgScore}%` : "—"} bg="bg-[#e9f1f6]" />
            <StatCard label="Passed" value={passed} bg="bg-[#e6f2ec]" />
            <StatCard label="Failed" value={failed} bg="bg-[#f5efe2]" />
          </div>

          {/* Chart */}
          {chartData.length > 0 && (
            <div className="rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-5 shadow-lg shadow-[#d9d3c7]/45">
              <p className="mb-4 text-sm font-semibold text-[#183247]">Score Trend</p>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2ddd6" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#5d6d78" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: "#5d6d78" }} axisLine={false} tickLine={false} unit="%" />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: "#edf4f8" }} />
                  <Bar dataKey="score" fill="#2f6668" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Results List */}
          <div className="space-y-4">
            {filtered.map((resultItem) => {
              const percentage =
                resultItem.totalMarks > 0
                  ? Math.round((resultItem.score / resultItem.totalMarks) * 100)
                  : 0;

              return (
                <div
                  key={resultItem._id}
                  className="rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-5 shadow-lg shadow-[#d9d3c7]/45"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="font-semibold text-[#183247]">{resultItem.examTitle}</p>
                      <p className="mt-1 text-sm text-[#5d6d78]">
                        {resultItem.className} | Submitted on{" "}
                        {new Date(resultItem.submittedAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <StatusBadge
                        tone={
                          resultItem.reviewStatus === "pending_review"
                            ? "warning"
                            : percentage >= 50
                            ? "success"
                            : "danger"
                        }
                      >
                        {resultItem.reviewStatus === "pending_review"
                          ? "Pending Review"
                          : percentage >= 50
                          ? "Passed"
                          : "Needs Improvement"}
                      </StatusBadge>
                      <StatusBadge tone="neutral" className="text-slate-700">
                        {resultItem.score} / {resultItem.totalMarks}
                      </StatusBadge>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl bg-[#edf4f8] px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#6d756d]">Score</p>
                      <p className="mt-1 text-lg font-semibold text-[#183247]">
                        {resultItem.score} / {resultItem.totalMarks}
                      </p>
                    </div>
                    <div className="rounded-2xl bg-[#e9f1f6] px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#6d756d]">Percentage</p>
                      <p className="mt-1 text-lg font-semibold text-[#183247]">{percentage}%</p>
                    </div>
                    <div className="rounded-2xl bg-[#f5efe2] px-4 py-3">
                      <p className="text-xs font-medium uppercase tracking-wide text-[#6d756d]">Review Status</p>
                      <p className="mt-1 text-lg font-semibold text-[#183247]">
                        {resultItem.reviewStatus === "pending_review" ? "Pending" : "Reviewed"}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
