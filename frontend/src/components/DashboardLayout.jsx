import { useState } from "react";

const NAV = {
  teacher: [
    { label: "Classes", tab: "classes", icon: "classes" },
    { label: "Students", tab: "students", icon: "students" },
    { label: "Requests", tab: "requests", icon: "requests" },
    { label: "Create Exam", tab: "create-exam", icon: "exam" },
    { label: "Results", tab: "results", icon: "results" },
  ],
  student: [
    { label: "My Classes", tab: "classes", icon: "classes" },
    { label: "Exams", tab: "exams", icon: "exam" },
    { label: "Results", tab: "results", icon: "results" },
  ],
};

function BrandMark() {
  return (
    <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl border border-[#3e647c] bg-[radial-gradient(circle_at_top,_#3f708e_0%,_#294f67_58%,_#183247_100%)] shadow-lg shadow-[#102737]/30">
      <div className="absolute inset-1 rounded-[14px] border border-white/10" />
      <div className="absolute h-7 w-7 rounded-full border border-[#d9ebe9]/70" />
      <div className="absolute h-3 w-3 rounded-full bg-[#d9ebe9] shadow-[0_0_16px_rgba(217,235,233,0.55)]" />
      <div className="absolute h-8 w-1 rotate-45 rounded-full bg-[#d7c7a6]/80" />
    </div>
  );
}

function SidebarIcon({ type, active }) {
  const iconClasses = active ? "text-white" : "text-[#d6e0e7]";

  if (type === "classes") {
    return (
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconClasses}`} fill="none" stroke="currentColor" strokeWidth="1.9">
        <rect x="3.5" y="5" width="17" height="14" rx="2.5" />
        <path d="M8 3.5v3M16 3.5v3M3.5 9.5h17" />
      </svg>
    );
  }

  if (type === "students") {
    return (
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconClasses}`} fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M16.5 19a4.5 4.5 0 0 0-9 0" />
        <circle cx="12" cy="8.5" r="3.2" />
        <path d="M20 18a3.5 3.5 0 0 0-2.8-3.4M18 5.8a3 3 0 0 1 0 5.8" />
      </svg>
    );
  }

  if (type === "requests") {
    return (
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconClasses}`} fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M12 3.8 4.5 7.2V12c0 4.2 2.7 7.7 7.5 8.8 4.8-1.1 7.5-4.6 7.5-8.8V7.2L12 3.8Z" />
        <path d="m9.4 12 1.8 1.8 3.5-3.7" />
      </svg>
    );
  }

  if (type === "exam") {
    return (
      <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconClasses}`} fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="M7 3.8h8l4 4V20a1.8 1.8 0 0 1-1.8 1.8H7A1.8 1.8 0 0 1 5.2 20V5.6A1.8 1.8 0 0 1 7 3.8Z" />
        <path d="M15 3.8v4h4M8.5 12h7M8.5 16h5" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" className={`h-5 w-5 ${iconClasses}`} fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M6.5 6.5h11v11h-11z" />
      <path d="M9 15.2 11 17l4-5.2" />
    </svg>
  );
}

function CollapseIcon({ collapsed }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d={collapsed ? "m10 6 6 6-6 6" : "m14 6-6 6 6 6"} />
    </svg>
  );
}

export default function DashboardLayout({ children, activeTab, onTabChange }) {
  const role = localStorage.getItem("role");
  const name = localStorage.getItem("name") || "User";
  const navItems = NAV[role] || [];
  const roleLabel = role === "teacher" ? "Instructor Access" : "Student Access";
  const [collapsed, setCollapsed] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const sidebarWidthClass = collapsed ? "w-24" : "w-72";
  const mainOffsetClass = collapsed ? "ml-24" : "ml-72";

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f2ede3_0%,#f8f5ee_42%,#e8eef2_100%)]">
      <aside
        className={`fixed inset-y-0 left-0 z-20 ${sidebarWidthClass} border-r border-[#203d52] bg-[#102737] text-slate-100 shadow-2xl shadow-[#102737]/20 transition-[width] duration-300`}
      >
        <button
          className="absolute -right-3 top-1/2 z-30 flex h-16 w-6 -translate-y-1/2 items-center justify-center rounded-full border border-[#35546a] bg-[#163247] text-[#d6e0e7] shadow-md shadow-[#102737]/25 transition hover:border-[#5a7b92] hover:bg-[#1c3c54] hover:text-white"
          onClick={() => setCollapsed((current) => !current)}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <CollapseIcon collapsed={collapsed} />
        </button>

        <div className="flex h-full flex-col">
          <div className="border-b border-[#23465d] px-4 py-5">
            <div className={`flex items-center ${collapsed ? "justify-center" : "gap-3"}`}>
              {!collapsed && (
                <div className="flex min-w-0 items-center gap-4">
                  <BrandMark />
                  <div className="min-w-0">
                    <h1 className="truncate text-lg font-semibold tracking-tight text-white">
                      Exam Sphere
                    </h1>
                    <p className="text-xs text-[#9eb2bf]">Online exam workspace</p>
                  </div>
                </div>
              )}

              {collapsed && <BrandMark />}
            </div>
          </div>

          <nav className={`flex-1 space-y-2 overflow-y-auto ${collapsed ? "px-3 py-5" : "px-4 py-6"}`}>
            {navItems.map((item) => {
              const isActive = activeTab === item.tab;

              return (
                <button
                  key={item.tab}
                  onClick={() => onTabChange && onTabChange(item.tab)}
                  title={collapsed ? item.label : undefined}
                  className={`flex w-full items-center rounded-2xl text-left text-sm font-medium transition ${
                    collapsed ? "justify-center px-3 py-3.5" : "gap-3 px-4 py-3.5"
                  } ${
                    isActive
                      ? "bg-gradient-to-r from-[#294f67] to-[#2f6668] text-white shadow-lg shadow-[#102737]/20"
                      : "text-[#d6e0e7] hover:bg-[#163247] hover:text-white"
                  }`}
                >
                  <SidebarIcon type={item.icon} active={isActive} />
                  {!collapsed && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>

          <div className={`border-t border-[#23465d] ${collapsed ? "px-3 py-4" : "px-4 py-4"}`}>
            <div className="relative">
              <button
                onClick={() => setProfileOpen((current) => !current)}
                className={`flex w-full items-center rounded-2xl transition hover:bg-[#163247] ${collapsed ? "justify-center px-2 py-2" : "gap-3 px-2 py-2"}`}
                aria-label="Open profile menu"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#3f708e] to-[#2f6668] text-sm font-bold text-white">
                  {name.charAt(0).toUpperCase()}
                </div>
                {!collapsed && (
                  <div className="min-w-0 text-left">
                    <p className="truncate text-sm font-semibold text-white">{name}</p>
                    <p className="text-xs text-[#9eb2bf]">{roleLabel}</p>
                  </div>
                )}
              </button>

              {profileOpen && (
                <div className="absolute bottom-[calc(100%+0.5rem)] left-0 z-30 w-48 rounded-2xl border border-[#d9d3c7] bg-[#fffaf0] p-2">
                  <div className="rounded-xl px-3 py-2">
                    <p className="truncate text-sm font-semibold text-[#183247]">{name}</p>
                    <p className="mt-1 text-xs text-[#5d6d78]">{roleLabel}</p>
                  </div>
                  <button
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium text-[#a84f45] transition hover:bg-[#f7e6e1]"
                    onClick={handleLogout}
                  >
                    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.9">
                      <path d="M10 6H6.8A1.8 1.8 0 0 0 5 7.8v8.4A1.8 1.8 0 0 0 6.8 18H10" />
                      <path d="m13 15 3-3-3-3M8 12h8" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </aside>

      <main className={`${mainOffsetClass} min-h-screen transition-[margin] duration-300`}>
        {children}
      </main>
      {profileOpen && (
        <button
          aria-label="Close profile menu"
          className="fixed inset-0 z-10 cursor-default bg-transparent"
          onClick={() => setProfileOpen(false)}
        />
      )}
    </div>
  );
}
