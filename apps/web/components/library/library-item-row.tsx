import type { LibraryItem } from "@context-layer/mocks";

export function LibraryItemRow({ item }: { item: LibraryItem }) {
  const icon = item.mime.startsWith("audio/") ? "Audio" : item.mime.startsWith("video/") ? "Video" : item.mime === "application/pdf" ? "PDF" : "File";

  return (
    <div data-library-item className="bg-white rounded-2xl p-6 shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px] flex flex-col">
      <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center mb-4 text-[11px] font-waldenburg-bold uppercase tracking-[0.5px]">
        {icon}
      </div>
      <h3 className="font-waldenburg text-[18px] mb-2 truncate" title={item.title}>{item.title}</h3>
      <p className="text-[12px] text-neutral-500 mb-4 capitalize">
        {item.sourceTool} • {item.createdAt.slice(0, 10)}
      </p>
      <button className="text-[13px] font-medium border border-neutral-200 px-4 py-1.5 rounded-full w-full hover:bg-neutral-50 mt-auto">
        Download
      </button>
    </div>
  );
}
