"use client";
import type { ButtonHTMLAttributes } from "react";
import { Button, type Variant } from "@/components/ui/Buttons";
import { useBooking } from "./BookingProvider";

export default function BookButton({ variant = "wine", label, ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; label: string }) {
  const { open } = useBooking();
  return (
    <Button type="button" variant={variant} onClick={open} {...props}>
      {label}
    </Button>
  );
}
