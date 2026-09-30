import { z } from "zod";
import { BOOKING_SLOTS, MAX_GUESTS } from "./config";

const dateRe = /^\d{4}-\d{2}-\d{2}$/;

/** Today's date in the restaurant's timezone (Europe/Athens), as YYYY-MM-DD. */
export function todayAthens() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Athens" }).format(new Date());
}

export const reservationSchema = z.object({
  name: z.string().trim().min(1).max(80),
  date: z
    .string()
    .regex(dateRe)
    .refine((d) => !Number.isNaN(Date.parse(`${d}T12:00:00Z`)), "Invalid date")
    .refine((d) => d >= todayAthens(), "Date must be today or later")
    .refine((d) => {
      const max = new Date();
      max.setUTCFullYear(max.getUTCFullYear() + 1);
      return d <= max.toISOString().slice(0, 10);
    }, "Date too far ahead"),
  time: z.string().refine((t) => BOOKING_SLOTS.includes(t), "Invalid time slot"),
  guests: z.coerce.number().int().min(1).max(MAX_GUESTS),
  hotel: z.string().trim().max(120).optional().default(""),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(24)
    .regex(/^[+\d][\d\s().-]{5,23}$/, "Invalid phone"),
  email: z.union([z.literal(""), z.string().trim().email().max(120)]).optional().default(""),
  special_request: z.string().trim().max(500).optional().default(""),
  language: z.enum(["en", "el"]).default("en"),
  source: z.enum(["/", "/book"]).default("/"),
  utm_source: z.string().max(200).optional(),
  utm_medium: z.string().max(200).optional(),
  utm_campaign: z.string().max(200).optional(),
  utm_content: z.string().max(200).optional(),
  utm_term: z.string().max(200).optional(),
  gclid: z.string().max(200).optional(),
  /** Honeypot — must be empty (checked in the route so bots get a fake 200). */
  website: z.string().max(500).optional().default(""),
});

export type ReservationInput = z.infer<typeof reservationSchema>;

export const RESERVATION_STATUSES = ["pending", "confirmed", "declined", "cancelled"] as const;
export type ReservationStatus = (typeof RESERVATION_STATUSES)[number];

export type Reservation = ReservationInput & {
  id: string;
  created_at: string;
  status: ReservationStatus;
};

/** Strip control characters; keeps Greek/Unicode letters intact. */
export function sanitise(s: string) {
  return s.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "").trim();
}
