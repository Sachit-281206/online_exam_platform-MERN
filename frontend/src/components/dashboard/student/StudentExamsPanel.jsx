import StatusBadge from "../StatusBadge";

export default function StudentExamsPanel({
  classes,
  exams,
  activeClassId,
  pendingExams,
  attemptedExams,
  submitError,
  onSelectClass,
  onOpenExam,
}) {
  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {classes.map((cls) => (
          <button
            key={cls._id}
            onClick={() => onSelectClass(cls._id)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              activeClassId === cls._id
                ? "border-transparent bg-gradient-to-r from-[#294f67] to-[#2f6668] text-white"
                : "border-[#c8d1d8] bg-[#fffdf8] text-[#4e6676] hover:bg-[#edf4f8]"
            }`}
          >
            {cls.className}
          </button>
        ))}
      </div>

      {exams.length === 0 ? (
        <p className="text-sm text-[#7e877e]">No exams available for this class.</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#183247]">Not Attempted</h3>
            {pendingExams.length === 0 ? (
              <p className="text-sm text-[#7e877e]">No pending exams in this class.</p>
            ) : (
              <div className="space-y-3">
                {pendingExams.map((exam) => (
                  <div
                    key={exam._id}
                    className="flex items-center justify-between rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-5 shadow-md shadow-[#d9d3c7]/45"
                  >
                    <div>
                      <p className="font-semibold text-[#183247]">{exam.title}</p>
                      <p className="mt-0.5 text-xs text-[#5d6d78]">
                        {exam.duration} min | {exam.questions?.length ?? "?"} questions
                      </p>
                    </div>
                    <button
                      className="rounded-lg bg-gradient-to-r from-[#294f67] to-[#2f6668] px-4 py-2 text-sm text-white transition hover:from-[#203d52] hover:to-[#29595b]"
                      onClick={() => onOpenExam(exam._id)}
                    >
                      Start Exam
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <h3 className="mb-3 text-sm font-semibold text-[#183247]">Attempted</h3>
            {attemptedExams.length === 0 ? (
              <p className="text-sm text-[#7e877e]">You have not attempted any exams yet.</p>
            ) : (
              <div className="space-y-3">
                {attemptedExams.map((exam) => (
                  <div
                    key={exam._id}
                    className="flex items-center justify-between rounded-3xl border border-[#bfd7d4] bg-[#e9f3f2] p-5 shadow-md shadow-[#dceceb]/45"
                  >
                    <div>
                      <p className="font-semibold text-[#183247]">{exam.title}</p>
                      <p className="mt-0.5 text-xs text-[#5d6d78]">
                        {exam.duration} min | {exam.questions?.length ?? "?"} questions
                      </p>
                      <p className="mt-1 text-xs text-[#5d6d78]">
                        View marks and status in the Results tab.
                      </p>
                    </div>
                    <StatusBadge tone={exam.reviewStatus === "pending_review" ? "warning" : "success"}>
                      {exam.reviewStatus === "pending_review" ? "Pending Review" : "Completed"}
                    </StatusBadge>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {submitError && (
        <div className="mt-4 rounded-lg border border-[#dfb4ad] bg-[#f7e6e1] p-3">
          <p className="text-sm text-[#a84f45]">{submitError}</p>
        </div>
      )}
    </div>
  );
}
