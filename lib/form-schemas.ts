import type { DateRange } from "@cloudflare/kumo";
import { z } from "zod";

const dateRangeSchema = z
  .custom<DateRange>(
    (value) =>
      Boolean(
        value &&
          typeof value === "object" &&
          "from" in value &&
          "to" in value &&
          value.from instanceof Date &&
          value.to instanceof Date,
      ),
    "Choose a check-in and check-out date.",
  )
  .superRefine((range, context) => {
    if (!range?.from || !range.to) return;
    const nights = Math.round(
      (range.to.getTime() - range.from.getTime()) / 86_400_000,
    );
    if (nights < 1) {
      context.addIssue({
        code: "custom",
        message: "Choose at least one night.",
      });
    }
  });

function fileSchema(
  acceptedTypes: string[],
  acceptedLabel: string,
  maxSize = 10 * 1024 * 1024,
) {
  return z
    .custom<File>(
      (value) => typeof File !== "undefined" && value instanceof File,
      "Choose a file to continue.",
    )
    .refine((file) => file.size <= maxSize, "File must be 10 MB or smaller.")
    .refine(
      (file) => acceptedTypes.includes(file.type),
      `Choose ${acceptedLabel}.`,
    );
}

export const quickBookingSchema = z
  .object({
    residence: z.enum(["two-bedroom", "three-bedroom"]),
    checkIn: z.date({ error: "Choose a check-in date." }),
    checkOut: z.date({ error: "Choose a check-out date." }),
  })
  .superRefine((values, context) => {
    if (values.checkOut <= values.checkIn) {
      context.addIssue({
        code: "custom",
        path: ["checkOut"],
        message: "Check-out must be at least one night after check-in.",
      });
    }
  });

export const reservationSchema = z.object({
  apartmentId: z.enum(["two-bedroom", "three-bedroom"]),
  range: dateRangeSchema,
  guests: z.string().min(1, "Choose the number of guests."),
  name: z.string().trim().min(2, "Enter the primary guest's full name."),
  email: z.email("Enter a valid email address."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  notes: z.string().trim().max(500, "Keep the note under 500 characters."),
});

export const paymentSchema = z.object({
  paymentReceipt: fileSchema(
    ["image/png", "image/jpeg", "application/pdf"],
    "a PNG, JPG, or PDF file",
  ),
  transferNote: z.string().trim().max(500, "Keep the note under 500 characters."),
});

export const kycSchema = z.object({
  legalName: z.string().trim().min(2, "Enter your legal full name."),
  phone: z.string().trim().min(7, "Enter a valid phone number."),
  email: z.email("Enter a valid email address."),
  identificationType: z.enum([
    "passport",
    "national-id",
    "driver-license",
    "voter-card",
  ]),
  idNumber: z.string().trim().min(3, "Enter the document number."),
  dateOfBirth: z.date({ error: "Choose your date of birth." }),
  address: z.string().trim().min(8, "Enter your current residential address."),
  identityDocument: fileSchema(
    ["image/png", "image/jpeg", "application/pdf"],
    "a PNG, JPG, or PDF file",
  ),
  portrait: fileSchema(
    ["image/png", "image/jpeg"],
    "a PNG or JPG image",
  ),
  consent: z
    .boolean()
    .refine((value) => value, "Confirm that your details are accurate."),
});

export const pricingSchema = z.object({
  twoBedroom: z.number().min(0, "Enter a valid nightly rate."),
  threeBedroom: z.number().min(0, "Enter a valid nightly rate."),
});

export const blockedDatesSchema = z.object({
  range: z.custom<DateRange>(
    (value) =>
      Boolean(
        value &&
          typeof value === "object" &&
          "from" in value &&
          "to" in value &&
          value.from instanceof Date &&
          value.to instanceof Date,
      ),
    "Choose the dates to block.",
  ),
});

export type QuickBookingValues = z.infer<typeof quickBookingSchema>;
export type ReservationValues = z.infer<typeof reservationSchema>;
export type PaymentValues = z.infer<typeof paymentSchema>;
export type KycValues = z.infer<typeof kycSchema>;
export type PricingValues = z.infer<typeof pricingSchema>;
export type BlockedDatesValues = z.infer<typeof blockedDatesSchema>;
