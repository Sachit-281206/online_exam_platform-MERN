const TONES = {
  success: "bg-[#dceceb] text-[#2f6668]",
  warning: "bg-amber-100 text-amber-700",
  danger: "bg-rose-100 text-rose-700",
  neutral: "bg-[#e7ecef] text-[#52616b]",
  info: "bg-[#d7e5ee] text-[#294f67]",
};

export default function StatusBadge({ children, tone = "neutral", className = "" }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${TONES[tone] || TONES.neutral} ${className}`.trim()}
    >
      {children}
    </span>
  );
}
