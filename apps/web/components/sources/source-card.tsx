import type { Source } from "@context-layer/mocks";

export function SourceCard({ source }: { source: Source }) {
  const badgeColor =
    source.status === "indexed"
      ? "bg-green-50 text-green-700"
      : source.status === "indexing"
      ? "bg-amber-50 text-amber-700"
      : "bg-red-50 text-red-700";

  const icon = source.kind === "repo" ? "Repo" : source.kind === "file" ? "Doc" : "Chat";

  return (
    <div data-source-card className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]">
      <div className="flex justify-between items-start mb-6">
        <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-[11px] font-waldenburg-bold uppercase tracking-[0.5px]">
          {icon}
        </div>
        <span className={`px-3 py-1 text-[11px] font-semibold rounded-full uppercase ${badgeColor}`}>{source.status}</span>
      </div>
      <h3 className="font-waldenburg text-[22px] mb-2 truncate">{source.name}</h3>
      <p className="text-neutral-500 text-[13px]">
        {source.provider}
        {source.branch ? ` / ${source.branch}` : ""}
      </p>
    </div>
  );
}
