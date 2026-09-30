import type { HTMLAttributes } from "react";

export function Label({ className = "", tone = "olive", ...props }: HTMLAttributes<HTMLParagraphElement> & { tone?: "olive" | "light" }) {
  return <p data-reveal="up" className={`label m-0 ${tone === "olive" ? "text-olive" : "opacity-75"} ${className}`} {...props} />;
}

export function Display({ className = "", as: Tag = "h2", ...props }: HTMLAttributes<HTMLHeadingElement> & { as?: "h1" | "h2" | "h3" }) {
  return <Tag data-reveal="up" className={`font-serif font-light m-0 ${className}`} {...props} />;
}
