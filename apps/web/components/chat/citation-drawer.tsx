"use client";

import { AnimatePresence, motion } from "motion/react";
import { Code2, ExternalLink, FileText, X } from "lucide-react";
import { cn } from "@/lib/cn";

export interface CitedFile {
  path: string;
  lineStart?: number;
  lineEnd?: number;
  lines: string[]; // each element is one line of text
  highlightFrom?: number; // 1-based line within `lines` to highlight
  highlightTo?: number;
  summary?: string;
}

const DEFAULT_CITED: Record<string, CitedFile> = {
  "@catalog-service/outbox.py:42-58": {
    path: "catalog-service/outbox.py",
    lineStart: 38,
    lineEnd: 60,
    highlightFrom: 5,
    highlightTo: 18,
    summary: "Transactional outbox writer used by every service in the workspace.",
    lines: [
      "import uuid",
      "from datetime import datetime",
      "",
      "class OutboxWriter:",
      "    \"\"\"Writes domain events inside the caller's DB transaction.\"\"\"",
      "",
      "    def __init__(self, session: Session):",
      "        self.session = session",
      "",
      "    def enqueue(self, topic: str, payload: dict) -> None:",
      "        row = OutboxRow(",
      "            id=uuid.uuid4(),",
      "            topic=topic,",
      "            payload=payload,",
      "            created_at=datetime.utcnow(),",
      "            status=\"pending\",",
      "        )",
      "        self.session.add(row)",
      "        # NOTE: commit happens when caller commits the outer tx.",
      "        # The outbox relay (separate pod) will tail this table",
      "        # into Kafka via Debezium and flip status to 'published'.",
      "",
      "    def replay_failed(self, max_attempts: int = 5) -> int:",
    ],
  },
  "@order-service/saga.py:120-180": {
    path: "order-service/saga.py",
    lineStart: 115,
    lineEnd: 182,
    highlightFrom: 8,
    highlightTo: 24,
    summary: "Canonical order saga. Coordinates reservation → pricing → confirmation.",
    lines: [
      "class OrderPlacementSaga:",
      "    def __init__(self, inv: InventoryClient, prc: PricingClient, nts: KafkaProducer):",
      "        self.inv, self.prc, self.nts = inv, prc, nts",
      "",
      "    async def place(self, cmd: PlaceOrderCommand) -> Order:",
      "        state = SagaState.new(cmd.order_id)",
      "        state.step(\"reserve\").start()",
      "",
      "        reservation = await self.inv.reserve(cmd.items, idempotency_key=cmd.key)",
      "        state.step(\"reserve\").ok(reservation.id)",
      "",
      "        try:",
      "            total = await self.prc.calculate(cmd.items)",
      "            state.step(\"price\").ok(total)",
      "        except PricingError:",
      "            await self.inv.release(reservation.id)",
      "            state.abort(\"pricing-failed\")",
      "            raise",
      "",
      "        order = Order.persist(cmd, total, reservation.id)",
      "        self.nts.emit(OrderPlaced(order.id, order.customer_id))",
      "        state.complete()",
      "        return order",
    ],
  },
  "@catalog-service/api/tmf620.py:1-220": {
    path: "catalog-service/api/tmf620.py",
    lineStart: 1,
    lineEnd: 24,
    highlightFrom: 5,
    highlightTo: 18,
    summary: "TMF620 Product Catalog Management endpoints.",
    lines: [
      "from fastapi import APIRouter, Depends, Query",
      "from shared_lib.models.tmf620 import Product, ProductSpecification",
      "from app.service import catalog",
      "",
      "router = APIRouter(prefix=\"/tmf-api/productCatalogManagement/v4\")",
      "",
      "@router.get(\"/product\", response_model=list[Product])",
      "async def list_products(",
      "    fields: str | None = Query(None, description=\"TMF sparse fields\"),",
      "    limit: int = 100,",
      ") -> list[Product]:",
      "    return await catalog.search(fields=fields, limit=limit)",
      "",
      "@router.post(\"/product\", status_code=201)",
      "async def create_product(body: Product) -> Product:",
      "    return await catalog.create(body)",
      "",
      "@router.get(\"/productSpecification\", response_model=list[ProductSpecification])",
      "async def list_specs(limit: int = 100) -> list[ProductSpecification]:",
      "    return await catalog.specs(limit=limit)",
    ],
  },
};

export function resolveCitation(target: string): CitedFile {
  return (
    DEFAULT_CITED[target] ?? {
      path: target.replace(/^@/, ""),
      lines: [`// ${target}`, "// Full citation content would load here."],
      summary: "Cited context",
    }
  );
}

export function CitationDrawer({
  target,
  onClose,
}: {
  target: string | null;
  onClose: () => void;
}) {
  const cited = target ? resolveCitation(target) : null;

  return (
    <AnimatePresence>
      {target && cited && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/15 backdrop-blur-sm md:bg-transparent md:backdrop-blur-none"
            onClick={onClose}
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 z-50 flex h-full w-full max-w-[520px] flex-col border-l border-[var(--color-border-subtle)] bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.06),rgba(0,0,0,0.12)_0_30px_60px]"
          >
            <div className="flex items-center justify-between border-b border-[var(--color-border-subtle)] px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[var(--color-ink)] text-white">
                  <Code2 size={15} strokeWidth={1.6} />
                </span>
                <div>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-[var(--color-ink-whisper)]">
                    Citation
                  </div>
                  <div className="font-display text-[18px] leading-tight">{cited.path}</div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  title="Open file"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
                >
                  <ExternalLink size={14} strokeWidth={1.6} />
                </button>
                <button
                  onClick={onClose}
                  title="Close"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--color-ink-muted)] transition-colors hover:bg-black/[0.04] hover:text-[var(--color-ink)]"
                >
                  <X size={15} strokeWidth={1.6} />
                </button>
              </div>
            </div>

            {cited.summary && (
              <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/70 px-6 py-3 text-[13px] text-[var(--color-ink-muted)]">
                {cited.summary}
              </div>
            )}

            <div className="flex-1 overflow-y-auto px-5 py-5">
              <div className="rounded-[14px] bg-[var(--color-ink)] p-5 shadow-lift">
                <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-white/40">
                  <span className="flex items-center gap-1.5">
                    <FileText size={10} strokeWidth={1.8} />
                    {cited.path}
                  </span>
                  <span>
                    lines {cited.lineStart ?? 1}–{cited.lineEnd ?? cited.lines.length}
                  </span>
                </div>
                <div className="font-mono text-[12.5px] leading-[1.8] text-white/85">
                  {cited.lines.map((line, i) => {
                    const lineNumber = (cited.lineStart ?? 1) + i;
                    const isHighlighted =
                      cited.highlightFrom &&
                      cited.highlightTo &&
                      i + 1 >= cited.highlightFrom &&
                      i + 1 <= cited.highlightTo;
                    return (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -4 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.012 }}
                        className={cn(
                          "flex gap-4 rounded-[4px] px-2 -mx-2",
                          isHighlighted && "bg-[rgba(201,165,114,0.15)] shadow-[inset_3px_0_0_rgba(201,165,114,0.8)]",
                        )}
                      >
                        <span className="w-8 shrink-0 select-none text-right text-white/25">{lineNumber}</span>
                        <span className="whitespace-pre">{line || " "}</span>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)]/70 px-6 py-3 font-mono text-[10.5px] uppercase tracking-[0.16em] text-[var(--color-ink-whisper)]">
              Context Layer · Citation drawer
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
