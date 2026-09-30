import type { ReservationStatus } from "@/lib/schema";

export function StatusBadge({ status }: { status: ReservationStatus }) {
  const cls: Record<ReservationStatus, string> = {
    pending: "bg-gold/25 text-wine-dark",
    confirmed: "bg-olive/20 text-olive",
    declined: "bg-terracotta/20 text-terracotta",
    cancelled: "bg-wine-dark/10 text-ink",
  };
  return <span className={`inline-block px-2 py-[2px] text-[11px] tracking-[.14em] uppercase ${cls[status]}`}>{status}</span>;
}
