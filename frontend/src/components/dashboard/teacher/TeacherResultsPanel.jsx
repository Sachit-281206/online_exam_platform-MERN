import SectionCard from "../SectionCard";
import StatusBadge from "../StatusBadge";

function ClassSelector({ classes, onSelectClass }) {
  return (
    <SectionCard
      title="Select Class"
      className="shadow-sm"
    >
      <div className="mt-4 flex flex-wrap gap-2">
        {classes.map((cls) => (
          <button
            key={cls._id}
            onClick={() => onSelectClass(cls._id)}
            className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-2 text-sm font-medium text-[#4e6676] transition hover:border-[#9fc2c3] hover:bg-[#e9f3f2] hover:text-[#2f6668]"
          >
            {cls.className}
          </button>
        ))}
      </div>
    </SectionCard>
  );
}

function ResultsTable({ classExams, examResults, selectedExamId, onSelectExam, onReviewSubmission }) {
  return (
    <SectionCard
      title="Exam Results"
      className="shadow-sm"
    >
      {classExams.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {classExams.map((exam) => (
            <button
              key={exam._id}
              onClick={() => onSelectExam(exam._id)}
              className={`rounded-2xl border px-4 py-2 text-sm font-medium transition ${
                selectedExamId === exam._id
                  ? "border-[#183247] bg-[#183247] text-white"
                  : "border-[#d9d3c7] bg-[#fffdf8] text-[#4e6676] hover:bg-[#f4eee4]"
              }`}
            >
              {exam.title}
            </button>
          ))}
        </div>
      )}

      {examResults.length === 0 ? (
        <p className="mt-5 text-sm text-[#5d6d78]">
          {classExams.length === 0
            ? "Select a class above to load its exams."
            : "Select an exam above to view results."}
        </p>
      ) : (
        <div className="mt-5 overflow-hidden rounded-2xl border border-[#d9d3c7]">
          <table className="w-full text-sm">
            <thead className="bg-[#f4eee4] text-left text-[#6d756d]">
              <tr>
                <th className="px-4 py-3 font-medium">Student</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Score</th>
                <th className="px-4 py-3 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="bg-[#fffdf8]">
              {examResults.map((result) => (
                <tr key={result.studentId} className="border-t border-[#e1d8c9]">
                  <td className="px-4 py-3 text-[#183247]">{result.name}</td>
                  <td className="px-4 py-3 text-[#5d6d78]">{result.email}</td>
                  <td className="px-4 py-3">
                    {result.attempted ? (
                      <StatusBadge tone={result.reviewStatus === "pending_review" ? "warning" : "success"}>
                        {result.reviewStatus === "pending_review" ? "Pending Review" : "Completed"}
                      </StatusBadge>
                    ) : (
                      <StatusBadge tone="neutral">Not Attempted</StatusBadge>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-[#183247]">
                    {result.attempted ? `${result.score} / ${result.totalMarks}` : "-"}
                  </td>
                  <td className="px-4 py-3">
                    {result.attempted ? (
                      <button
                        onClick={() => onReviewSubmission(result.studentId)}
                        className="rounded-xl border border-[#c8d1d8] bg-[#fffdf8] px-3 py-2 text-xs font-medium text-[#294f67] transition hover:border-[#9fc2c3] hover:bg-[#e9f3f2] hover:text-[#2f6668]"
                      >
                        Review Submission
                      </button>
                    ) : (
                      <span className="text-xs text-[#7e877e]">No submission</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </SectionCard>
  );
}

function SubmissionReview({
  selectedSubmission,
  loadingSubmission,
  gradeDrafts,
  savingGrades,
  onGradeDraftChange,
  onSaveGrades,
}) {
  if (!loadingSubmission && !selectedSubmission) {
    return null;
  }

  return (
    <SectionCard className="shadow-sm">
      {loadingSubmission ? (
        <p className="text-sm text-[#5d6d78]">Loading submission...</p>
      ) : (
        <>
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-[#183247]">Submission Review</h3>
              <p className="mt-1 text-sm text-[#5d6d78]">
                {selectedSubmission.student.name} | {selectedSubmission.student.email}
              </p>
            </div>
            <div className="rounded-2xl bg-[#edf1f2] px-4 py-3 text-sm text-[#4e6676]">
              Score:{" "}
              <span className="font-semibold text-[#183247]">
                {selectedSubmission.score} / {selectedSubmission.totalMarks}
              </span>
            </div>
          </div>

          <div className="space-y-4">
            {selectedSubmission.answers.map((answer) => (
              <div key={answer.questionIndex} className="rounded-2xl border border-[#ddd6c9] bg-[#fffdf8] p-4">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-[#183247]">
                      Question {answer.questionIndex + 1}
                    </p>
                    <p className="mt-1 text-sm text-[#355061]">{answer.questionText}</p>
                  </div>
                  <StatusBadge tone="neutral" className="text-slate-600">
                    {answer.type === "mcq" ? "MCQ" : "Theory"} | {answer.maxMarks} marks
                  </StatusBadge>
                </div>

                <div className="mt-3 rounded-2xl bg-[#f4eee4] p-4 text-sm">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#6d756d]">Student Answer</p>
                  <p className="mt-2 whitespace-pre-wrap text-[#355061]">
                    {answer.answer || "No answer submitted"}
                  </p>
                </div>

                {answer.type === "mcq" ? (
                  <div className="mt-3 text-sm text-[#4e6676]">
                    Correct answer:{" "}
                    <span className="font-medium text-[#183247]">{answer.correctAnswer}</span>
                  </div>
                ) : (
                  <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-[140px,1fr]">
                    <input
                      type="number"
                      min="0"
                      max={answer.maxMarks}
                      value={gradeDrafts[answer.questionIndex]?.awardedMarks ?? 0}
                      onChange={(event) =>
                        onGradeDraftChange(answer.questionIndex, {
                          awardedMarks: event.target.value,
                          feedback: gradeDrafts[answer.questionIndex]?.feedback || "",
                        })
                      }
                      className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
                      placeholder="Marks"
                    />
                    <textarea
                      rows="3"
                      value={gradeDrafts[answer.questionIndex]?.feedback || ""}
                      onChange={(event) =>
                        onGradeDraftChange(answer.questionIndex, {
                          awardedMarks: gradeDrafts[answer.questionIndex]?.awardedMarks ?? 0,
                          feedback: event.target.value,
                        })
                      }
                      className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
                      placeholder="Optional feedback for the student"
                    />
                  </div>
                )}

                <div className="mt-3 text-sm text-[#4e6676]">
                  Awarded marks:{" "}
                  <span className="font-medium text-[#183247]">{answer.awardedMarks}</span>
                </div>
              </div>
            ))}
          </div>

          {selectedSubmission.answers.some((answer) => answer.type === "theory") && (
            <div className="mt-5 flex justify-end">
              <button
                onClick={onSaveGrades}
                disabled={savingGrades}
                className="rounded-2xl bg-[#294f67] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#203d52] disabled:opacity-60"
              >
                {savingGrades ? "Saving..." : "Save Grades"}
              </button>
            </div>
          )}
        </>
      )}
    </SectionCard>
  );
}

export default function TeacherResultsPanel(props) {
  return (
    <div className="space-y-5">
      <ClassSelector classes={props.classes} onSelectClass={props.onSelectClass} />
      <ResultsTable
        classExams={props.classExams}
        examResults={props.examResults}
        selectedExamId={props.selectedExamId}
        onSelectExam={props.onSelectExam}
        onReviewSubmission={props.onReviewSubmission}
      />
      <SubmissionReview
        selectedSubmission={props.selectedSubmission}
        loadingSubmission={props.loadingSubmission}
        gradeDrafts={props.gradeDrafts}
        savingGrades={props.savingGrades}
        onGradeDraftChange={props.onGradeDraftChange}
        onSaveGrades={props.onSaveGrades}
      />
    </div>
  );
}
