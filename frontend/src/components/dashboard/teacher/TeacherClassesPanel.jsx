import EmptyState from "../EmptyState";
import SectionCard from "../SectionCard";
import StatusBadge from "../StatusBadge";

export default function TeacherClassesPanel({
  classes,
  className,
  onClassNameChange,
  onCreateClass,
  onShowResults,
  onCopyJoinCode,
}) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Create Class"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            className="flex-1 rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
            placeholder="Class name"
            type="text"
            value={className}
            onChange={(event) => onClassNameChange(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && onCreateClass()}
          />
          <button
            className="rounded-2xl bg-gradient-to-r from-[#294f67] to-[#2f6668] px-5 py-3 text-sm font-medium text-white transition hover:from-[#203d52] hover:to-[#29595b]"
            onClick={onCreateClass}
          >
            Create Class
          </button>
        </div>
      </SectionCard>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {classes.length === 0 && <EmptyState message="No classes yet. Create your first class above." />}

        {classes.map((cls) => (
          <div
            key={cls._id}
            className="rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-5 shadow-lg shadow-[#d9d3c7]/45 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#d9d3c7]/55"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-semibold text-[#183247]">{cls.className}</h3>
                <p className="mt-1 text-sm text-[#5d6d78]">{cls.students.length} enrolled</p>
              </div>
              <StatusBadge tone="success">Active</StatusBadge>
            </div>

            <div className="mt-5 rounded-2xl bg-[#edf4f8] p-4">
              <p className="text-xs uppercase tracking-[0.18em] text-[#6d756d]">Join Code</p>
              <button
                className="mt-2 rounded-xl bg-[#fffdf8] px-3 py-2 font-mono text-sm font-semibold text-[#294f67] shadow-sm transition hover:bg-[#dfeaf1]"
                title="Click to copy"
                onClick={() => onCopyJoinCode(cls.joinCode)}
              >
                {cls.joinCode}
              </button>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs uppercase tracking-[0.18em] text-[#6d756d]">
                Enrolled Students
              </p>
              {cls.students.length === 0 ? (
                <p className="text-sm text-[#7e877e]">No students yet.</p>
              ) : (
                <div className="space-y-2">
                  {cls.students.map((student) => (
                    <div
                      key={student._id}
                      className="rounded-2xl border border-[#e1d8c9] bg-[#f7f1e6] px-3 py-2 text-sm text-[#4e6676]"
                    >
                      {student.name}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              className="mt-5 w-full rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm font-medium text-[#294f67] transition hover:border-[#9fc2c3] hover:bg-[#e9f3f2] hover:text-[#2f6668]"
              onClick={() => onShowResults(cls._id)}
            >
              View Exams and Results
            </button>
          </div>
        ))}
      </section>
    </div>
  );
}
