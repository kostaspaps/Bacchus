import type { CSSProperties, ReactNode } from "react";

/**
 * The recurring framed figure: thin wine-red rule, 10–14px padding, optional arch (rounded top).
 * `tone` switches the rule colour for dark / sea / gold contexts.
 */
export function Frame({
  children,
  caption,
  captionRight,
  arch = false,
  tone = "light",
  pad = 12,
  className = "",
  style,
  reveal = "up",
  captionCenter = false,
}: {
  children: ReactNode;
  caption?: ReactNode;
  captionRight?: ReactNode;
  arch?: boolean;
  tone?: "light" | "dark" | "sea" | "gold";
  pad?: number;
  className?: string;
  style?: CSSProperties;
  reveal?: "up" | "mask" | "left" | null;
  captionCenter?: boolean;
}) {
  const border =
    tone === "light"
      ? "border-wine/30"
      : tone === "sea"
        ? "border-ivory/35"
        : tone === "gold"
          ? "border-gold/40"
          : "border-ivory/20";
  const capColor = tone === "light" ? "text-olive" : "opacity-75";
  return (
    <figure
      data-reveal={reveal ?? undefined}
      className={`m-0 border ${border} ${arch ? "arch" : ""} ${className}`}
      style={{ padding: pad, ...style }}
    >
      <div className={`relative overflow-hidden ${arch ? "arch" : ""}`}>{children}</div>
      {(caption || captionRight) && (
        <figcaption
          className={`caption flex gap-3 pt-3 px-1 ${capColor} ${captionCenter ? "justify-center text-center" : "justify-between"}`}
        >
          {caption && <span>{caption}</span>}
          {captionRight && <span>{captionRight}</span>}
        </figcaption>
      )}
    </figure>
  );
}
