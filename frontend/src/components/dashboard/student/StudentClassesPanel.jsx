import EmptyState from "../EmptyState";
import SectionCard from "../SectionCard";

export default function StudentClassesPanel({
  joinCode,
  joinMessage,
  classes,
  onJoinCodeChange,
  onJoinClass,
  onViewExams,
}) {
  return (
    <div>
      <SectionCard title="Join a Class" className="mb-6 border-[#c8dbe6] shadow-lg shadow-[#d7e5ee]/40">
        <div className="flex gap-3">
          <input
            className="flex-1 rounded-lg border border-[#c8d1d8] bg-[#fffdf8] px-4 py-2 text-sm text-[#274053] focus:outline-none focus:ring-2 focus:ring-[#294f67]"
            type="text"
            placeholder="Enter join code"
            value={joinCode}
            onChange={(event) => onJoinCodeChange(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && onJoinClass()}
          />
          <button
            className="rounded-lg bg-gradient-to-r from-[#294f67] to-[#2f6668] px-5 py-2 text-sm font-medium text-white transition hover:from-[#203d52] hover:to-[#29595b]"
            onClick={onJoinClass}
          >
            Join
          </button>
        </div>
        {joinMessage && (
          <p className={`mt-2 text-xs ${joinMessage.type === "success" ? "text-[#2f6668]" : "text-[#a84f45]"}`}>
            {joinMessage.text}
          </p>
        )}
      </SectionCard>

      <h2 className="mb-3 text-base font-semibold text-[#183247]">My Classes</h2>
      {classes.length === 0 ? (
        <EmptyState message="No classes yet. Join one above." className="border-none bg-transparent p-0 shadow-none" />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {classes.map((cls) => (
            <div
              key={cls._id}
              className="rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-5 shadow-md shadow-[#d9d3c7]/45"
            >
              <p className="font-semibold text-[#183247]">{cls.className}</p>
              <p className="mt-1 text-xs text-[#5d6d78]">Teacher: {cls.teacher?.name}</p>
              <button
                className="mt-3 rounded-lg bg-[#edf4f8] px-3 py-1.5 text-xs text-[#294f67] transition hover:bg-[#dfeaf1]"
                onClick={() => onViewExams(cls._id)}
              >
                View Exams -&gt;
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
