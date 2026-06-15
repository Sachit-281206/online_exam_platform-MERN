export default function SectionCard({ title, description, action, children, className = "" }) {
  return (
    <section
      className={`rounded-3xl border border-[#d9d3c7] bg-[#fffaf0]/95 p-6 shadow-lg shadow-[#d9d3c7]/45 ${className}`.trim()}
    >
      {(title || description || action) && (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            {title && <h2 className="text-lg font-semibold text-[#183247]">{title}</h2>}
            {description && <p className="mt-1 text-sm text-[#5d6d78]">{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
