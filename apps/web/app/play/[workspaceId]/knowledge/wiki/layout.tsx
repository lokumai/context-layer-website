"use client";

import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const ITEMS = [
  { href: "", label: "Status" },
  { href: "/view", label: "View" },
  { href: "/configure", label: "Configure" },
  { href: "/logs", label: "Logs" },
];

export default function WikiLayout({ children }: { children: React.ReactNode }) {
  const { workspaceId } = useParams<{ workspaceId: string }>();
  const pathname = usePathname();
  const base = `/play/${workspaceId}/knowledge/wiki`;

  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 border-r border-black/[0.05] bg-neutral-50 p-6 flex flex-col gap-1">
        <h2 className="font-waldenburg text-[24px] mb-6">Wiki</h2>
        {ITEMS.map((item) => {
          const href = `${base}${item.href}`;
          const active = pathname === href;
          return (
            <Link
              key={item.label}
              href={href}
              className={`font-medium text-[15px] px-3 py-2 rounded-lg ${active ? "bg-white shadow-[rgba(0,0,0,0.075)_0px_0px_0px_0.5px_inset,rgba(0,0,0,0.06)_0px_0px_0px_1px]" : "hover:bg-neutral-200"}`}
            >
              {item.label}
            </Link>
          );
        })}
      </aside>
      <div className="flex-1 overflow-y-auto p-8">{children}</div>
    </div>
  );
}
