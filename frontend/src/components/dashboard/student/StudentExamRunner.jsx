export default function StudentExamRunner({
  exam,
  answers,
  timeLeft,
  timerColor,
  submitError,
  isSubmitting,
  onAnswerChange,
  onGoBack,
  onSubmit,
}) {
  return (
    <div className="rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-6 shadow-lg shadow-[#d9d3c7]/45 backdrop-blur">
      <div className="mb-5 flex items-start justify-between">
        <h2 className="text-xl font-bold text-[#183247]">{exam.title}</h2>
        <div className={`rounded-xl bg-[#e7ecef] px-3 py-1 font-mono text-xl font-bold ${timerColor}`}>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </div>
      </div>

      <div className="space-y-6">
        {exam.questions.map((question, index) => (
          <div key={index} className="rounded-2xl border border-[#e1d8c9] bg-[#fcf6eb] p-5">
            <p className="mb-3 font-medium text-[#183247]">
              {index + 1}. {question.questionText}
            </p>
            {question.type === "theory" ? (
              <textarea
                rows="5"
                value={answers[index] || ""}
                onChange={(event) => onAnswerChange(index, event.target.value)}
                className="w-full rounded-xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
                placeholder="Write your answer here"
              />
            ) : (
              <div className="space-y-2">
                {question.options.map((option, optionIndex) => (
                  <label
                    key={optionIndex}
                    className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-2.5 transition ${
                      answers[index] === option
                        ? "border-[#294f67] bg-[#e9f1f6]"
                        : "border-[#ddd6c9] bg-[#fffdf8] hover:bg-[#edf4f8]"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => onAnswerChange(index, option)}
                      className="accent-[#294f67]"
                    />
                    <span className="text-sm text-[#355061]">{option}</span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <p className="text-xs text-[#6d756d]">
          {Object.keys(answers).length} of {exam.questions.length} answered
        </p>
        <div className="flex gap-3">
          {submitError && (
            <button
              className="rounded-lg bg-[#5d6d78] px-4 py-2.5 font-medium text-white transition hover:bg-[#4f616e]"
              onClick={onGoBack}
            >
              Go Back
            </button>
          )}
          <button
            className="rounded-lg bg-[#294f67] px-6 py-2.5 font-medium text-white transition hover:bg-[#203d52] disabled:opacity-60"
            disabled={isSubmitting}
            onClick={onSubmit}
          >
            {isSubmitting ? "Submitting..." : "Submit Exam"}
          </button>
        </div>
      </div>

      {submitError && (
        <div className="mt-4 rounded-lg border border-[#dfb4ad] bg-[#f7e6e1] p-3">
          <p className="text-sm text-[#a84f45]">{submitError}</p>
        </div>
      )}
    </div>
  );
}
