export default function ToastMessage({ toast }) {
  if (!toast) {
    return null;
  }

  return (
    <div
      className={`fixed right-6 top-6 z-50 rounded-2xl px-5 py-3 text-sm font-medium text-white shadow-lg ${
        toast.type === "error" ? "bg-[#b85f52]" : "bg-[#2f6668]"
      }`}
    >
      {toast.msg}
    </div>
  );
}
