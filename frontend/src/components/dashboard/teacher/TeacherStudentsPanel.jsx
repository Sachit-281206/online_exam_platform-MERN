import EmptyState from "../EmptyState";
import SectionCard from "../SectionCard";
import StatusBadge from "../StatusBadge";

export default function TeacherStudentsPanel({ classes, totalStudents }) {
  return (
    <div className="space-y-6">
      <SectionCard
        title="Your Students"
        action={
          <div className="rounded-2xl bg-[#edf1f2] px-4 py-3 text-sm text-[#4e6676]">
            Total enrolled students:{" "}
            <span className="font-semibold text-[#183247]">{totalStudents}</span>
          </div>
        }
      />

      {totalStudents === 0 ? (
        <EmptyState message="No students yet." className="shadow-sm" />
      ) : (
        <div className="space-y-6">
          {classes.map((cls) => (
            <section
              key={cls._id}
              className="rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-6 shadow-sm shadow-[#d9d3c7]/35"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-[#183247]">{cls.className}</h3>
                  <p className="mt-1 text-sm text-[#5d6d78]">
                    Join code: <span className="font-mono text-[#294f67]">{cls.joinCode}</span>
                  </p>
                </div>
                <div className="rounded-2xl bg-[#edf1f2] px-4 py-3 text-sm text-[#4e6676]">
                  Students enrolled:{" "}
                  <span className="font-semibold text-[#183247]">{cls.students.length}</span>
                </div>
              </div>

              {cls.students.length === 0 ? (
                <p className="mt-5 text-sm text-[#7e877e]">No students yet.</p>
              ) : (
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {cls.students.map((student) => (
                    <div
                      key={`${cls._id}-${student._id}`}
                      className="rounded-2xl border border-[#e1d8c9] bg-[#f7f1e6] p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <h4 className="text-base font-semibold text-[#183247]">{student.name}</h4>
                          <p className="mt-1 text-sm text-[#5d6d78]">{student.email}</p>
                        </div>
                        <StatusBadge tone="success">Enrolled</StatusBadge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
