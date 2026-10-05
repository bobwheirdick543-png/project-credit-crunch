import { z } from "zod";

export const emailSchema = z.string().trim().email("Enter a valid email address").max(255);
export const passwordSchema = z.string().min(8, "Use at least 8 characters").max(72).regex(/[A-Z]/, "Add one capital letter").regex(/[0-9]/, "Add one number").regex(/[^A-Za-z0-9]/, "Add one special character");
export const usernameSchema = z.string().trim().min(3, "Use at least 3 characters").max(24).regex(/^[a-zA-Z0-9_]+$/, "Use letters, numbers, or underscores only").refine((v) => !["admin", "soul", "test", "root"].includes(v.toLowerCase()), "That username is reserved");
export const whatsappSchema = z.string().trim().regex(/^\+234[789][01]\d{8}$/, "Use a Nigerian number like +2348012345678");

export function safeNext(value: unknown, fallback = "/dashboard") {
  return typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : fallback;
}