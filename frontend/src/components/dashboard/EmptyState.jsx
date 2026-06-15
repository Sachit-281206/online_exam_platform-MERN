export default function EmptyState({ message, className = "" }) {
  return (
    <div
      className={`rounded-3xl border border-dashed border-[#cfc3af] bg-[#fcf7ee] p-8 text-sm text-[#6d756d] ${className}`.trim()}
    >
      {message}
    </div>
  );
}
