import SectionCard from "../SectionCard";
import StatusBadge from "../StatusBadge";

export default function TeacherRequestsPanel({ requests, onApprove, onReject }) {
  return (
    <SectionCard
      title="Pending Requests"
      action={<StatusBadge tone="danger">{requests.length} pending</StatusBadge>}
      className="shadow-sm"
    >
      {requests.length === 0 ? (
        <p className="text-sm text-[#5d6d78]">No pending requests.</p>
      ) : (
        <div className="space-y-3">
          {requests.map((request) => (
            <div
              key={request._id}
              className="flex flex-col gap-4 rounded-2xl border border-[#ddd6c9] bg-[#fffdf8] px-4 py-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-[#183247]">{request.student.name}</p>
                <p className="mt-1 text-sm text-[#5d6d78]">{request.student.email}</p>
                <p className="mt-1 text-sm text-[#294f67]">
                  Class: {request.class?.className ?? "Unknown class"}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  className="rounded-xl bg-[#2f6668] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#29595b]"
                  onClick={() => onApprove(request._id)}
                >
                  Approve
                </button>
                <button
                  className="rounded-xl border border-[#dfb4ad] bg-[#f7e6e1] px-4 py-2 text-sm font-medium text-[#a84f45] transition hover:bg-[#f2d9d2]"
                  onClick={() => onReject(request._id)}
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </SectionCard>
  );
}
