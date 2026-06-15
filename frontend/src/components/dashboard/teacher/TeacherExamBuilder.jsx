import SectionCard from "../SectionCard";

function QuestionEditor({
  question,
  questionIndex,
  totalQuestions,
  onQuestionChange,
  onOptionChange,
  onRemove,
}) {
  return (
    <div className="rounded-3xl border border-[#ddd6c9] bg-[#fcf6eb] p-5">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <span className="text-sm font-semibold text-[#294f67]">Question {questionIndex + 1}</span>
        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={question.type}
            onChange={(event) => onQuestionChange(questionIndex, "type", event.target.value)}
            className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
          >
            <option value="mcq">Multiple Choice</option>
            <option value="theory">Theory</option>
          </select>
          <input
            type="number"
            min="1"
            value={question.maxMarks}
            onChange={(event) => onQuestionChange(questionIndex, "maxMarks", event.target.value)}
            className="w-32 rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
            placeholder="Marks"
          />
          {totalQuestions > 1 && (
            <button
              onClick={() => onRemove(questionIndex)}
              className="rounded-2xl border border-[#dfb4ad] bg-[#f7e6e1] px-4 py-3 text-sm font-medium text-[#a84f45] transition hover:bg-[#f2d9d2]"
            >
              Remove
            </button>
          )}
        </div>
      </div>

      <input
        type="text"
        placeholder="Question text"
        value={question.questionText}
        onChange={(event) => onQuestionChange(questionIndex, "questionText", event.target.value)}
        className="mb-3 w-full rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
      />

      {question.type === "mcq" ? (
        <>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {question.options.map((option, optionIndex) => (
              <input
                key={optionIndex}
                type="text"
                placeholder={`Option ${optionIndex + 1}`}
                value={option}
                onChange={(event) => onOptionChange(questionIndex, optionIndex, event.target.value)}
                className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
              />
            ))}
          </div>

          <select
            value={question.correctAnswer}
            onChange={(event) => onQuestionChange(questionIndex, "correctAnswer", event.target.value)}
            className="mt-3 w-full rounded-2xl border border-[#bfd7d4] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#2f6668] focus:ring-4 focus:ring-[#dceceb]"
          >
            <option value="">Select Correct Answer</option>
            {question.options.filter(Boolean).map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        </>
      ) : (
        <div className="rounded-2xl border border-dashed border-[#cfc3af] bg-[#fffdf8] px-4 py-4 text-sm text-[#6d756d]">
          Long answer, graded manually.
        </div>
      )}
    </div>
  );
}

export default function TeacherExamBuilder({
  classes,
  selectedClass,
  examTitle,
  duration,
  questions,
  onSelectedClassChange,
  onExamTitleChange,
  onDurationChange,
  onQuestionChange,
  onOptionChange,
  onAddQuestion,
  onRemoveQuestion,
  onCreateExam,
}) {
  return (
    <SectionCard title="Create Exam" className="shadow-sm">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <select
          className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
          onChange={(event) => onSelectedClassChange(event.target.value)}
          value={selectedClass}
        >
          <option value="">Select Class</option>
          {classes.map((cls) => (
            <option key={cls._id} value={cls._id}>
              {cls.className}
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Exam Title"
          value={examTitle}
          onChange={(event) => onExamTitleChange(event.target.value)}
          className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
        />
        <input
          type="number"
          placeholder="Duration (minutes)"
          value={duration}
          onChange={(event) => onDurationChange(event.target.value)}
          className="rounded-2xl border border-[#c8d1d8] bg-[#fffdf8] px-4 py-3 text-sm text-[#274053] outline-none transition focus:border-[#294f67] focus:ring-4 focus:ring-[#d7e5ee]"
        />
      </div>

      <div className="mt-6 space-y-4">
        {questions.map((question, index) => (
          <QuestionEditor
            key={index}
            question={question}
            questionIndex={index}
            totalQuestions={questions.length}
            onQuestionChange={onQuestionChange}
            onOptionChange={onOptionChange}
            onRemove={onRemoveQuestion}
          />
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          onClick={onAddQuestion}
          className="rounded-2xl border border-[#9fc2c3] bg-[#e9f3f2] px-5 py-3 text-sm font-medium text-[#2f6668] transition hover:bg-[#dceceb]"
        >
          Add Question
        </button>
        <button
          onClick={onCreateExam}
          className="rounded-2xl bg-[#294f67] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#203d52]"
        >
          Create Exam
        </button>
      </div>
    </SectionCard>
  );
}
