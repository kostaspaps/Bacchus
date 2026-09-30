import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";

const base = "btn";
export const variants = {
  wine: "bg-wine text-ivory hover:bg-wine-dark px-8 py-[18px]",
  ivory: "bg-ivory text-wine-dark hover:bg-terracotta hover:text-ivory px-7 py-4",
  outlineDark: "border border-wine-dark text-wine-dark hover:bg-wine-dark hover:text-ivory px-[22px] py-[14px] text-[11px]",
  outlineLight: "border border-ivory/50 text-ivory hover:bg-ivory hover:text-wine-dark px-7 py-4",
  ghostNav: "border border-current bg-transparent hover:bg-wine hover:border-wine hover:text-ivory px-[22px] py-3 text-[11px]",
  textDark: "border-b border-wine-dark px-2 py-[18px] rounded-none",
  textLight: "border-b border-ivory/60 px-2 py-[18px] rounded-none",
};
export type Variant = keyof typeof variants;

export function Button({ variant = "wine", className = "", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return <button className={`${base} ${variants[variant]} ${className}`} {...props} />;
}

export function LinkButton({ variant = "wine", className = "", ...props }: AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant }) {
  return <a className={`${base} ${variants[variant]} ${className}`} {...props} />;
}
