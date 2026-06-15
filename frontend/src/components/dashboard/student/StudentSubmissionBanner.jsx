import StatusBadge from "../StatusBadge";

export default function StudentSubmissionBanner({ submission, onDismiss }) {
  if (!submission) {
    return null;
  }

  const passed = submission.totalMarks > 0 && submission.score / submission.totalMarks >= 0.5;
  const tone = submission.reviewStatus === "pending_review" ? "warning" : passed ? "success" : "danger";
  const label =
    submission.reviewStatus === "pending_review"
      ? "Awaiting theory review"
      : passed
      ? "Passed"
      : "Failed";

  return (
    <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#bfd7d4] bg-[#e9f3f2] p-5 shadow-sm shadow-[#dceceb]/45">
      <div>
        <p className="font-semibold text-[#214f51]">Submission saved</p>
        <p className="mt-0.5 text-sm text-[#2f6668]">
          {submission.examTitle} was added to your results history.
        </p>
        <StatusBadge tone={tone} className="mt-1">
          {label}
        </StatusBadge>
      </div>
      <button onClick={onDismiss} className="text-xs text-[#2f6668] underline hover:text-[#214f51]">
        Dismiss
      </button>
    </div>
  );
}
