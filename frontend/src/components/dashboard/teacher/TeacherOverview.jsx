export default function TeacherOverview({ classesCount, totalStudents, requestsCount }) {
  const stats = [
    { label: "Classes", value: classesCount, classes: "border-[#c8dbe6] bg-[#edf4f8] shadow-[#d7e5ee]/60" },
    { label: "Students", value: totalStudents, classes: "border-[#bfd7d4] bg-[#e9f3f2] shadow-[#dceceb]/60" },
    { label: "Requests", value: requestsCount, classes: "border-[#d7c7a6] bg-[#f5efe2] shadow-[#eee1c9]/60" },
  ];

  return (
    <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-[#6d756d]">
          Teacher Dashboard
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#183247]">
          Classes, exams, and reviews
        </h1>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div key={stat.label} className={`rounded-2xl border px-4 py-4 shadow-sm ${stat.classes}`}>
            <p className="text-xs uppercase tracking-[0.18em] text-[#6d756d]">{stat.label}</p>
            <p className="mt-2 text-2xl font-semibold text-[#183247]">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
