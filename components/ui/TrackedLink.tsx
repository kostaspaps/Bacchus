"use client";
import type { AnchorHTMLAttributes } from "react";
import { track, type AnalyticsEvent } from "@/lib/analytics";

export default function TrackedLink({ event, onClick, ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { event: AnalyticsEvent }) {
  return (
    <a
      {...props}
      onClick={(e) => {
        track(event);
        onClick?.(e);
      }}
    />
  );
}
