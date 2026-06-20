import { fromDateKey, toDateKey } from "@/lib/date-utils";

const reservationDraftKey = "sbj-reservation-draft";
const paymentDraftKey = "sbj-payment-draft";
const residencePreferenceKey = "sbj-residence-preference";

export type ReservationDraft = {
  residence: "two-bedroom" | "three-bedroom";
  checkIn: Date;
  checkOut: Date;
};

export type PaymentDraft = {
  residence: string;
  nights: number;
  guests: number;
  total: number;
  windowStartedAt: number;
  windowExpiresAt: number;
};

export function saveReservationDraft(draft: ReservationDraft) {
  sessionStorage.setItem(
    reservationDraftKey,
    JSON.stringify({
      residence: draft.residence,
      checkIn: toDateKey(draft.checkIn),
      checkOut: toDateKey(draft.checkOut),
    }),
  );
}

export function saveResidencePreference(
  residence: ReservationDraft["residence"],
) {
  sessionStorage.setItem(residencePreferenceKey, residence);
}

export function consumeResidencePreference() {
  const residence = sessionStorage.getItem(residencePreferenceKey);
  sessionStorage.removeItem(residencePreferenceKey);
  return residence === "two-bedroom" || residence === "three-bedroom"
    ? residence
    : null;
}

export function consumeReservationDraft(): ReservationDraft | null {
  const raw = sessionStorage.getItem(reservationDraftKey);
  sessionStorage.removeItem(reservationDraftKey);
  if (!raw) return null;

  try {
    const draft = JSON.parse(raw) as {
      residence?: unknown;
      checkIn?: unknown;
      checkOut?: unknown;
    };
    if (
      (draft.residence === "two-bedroom" ||
        draft.residence === "three-bedroom") &&
      typeof draft.checkIn === "string" &&
      typeof draft.checkOut === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(draft.checkIn) &&
      /^\d{4}-\d{2}-\d{2}$/.test(draft.checkOut)
    ) {
      return {
        residence: draft.residence,
        checkIn: fromDateKey(draft.checkIn),
        checkOut: fromDateKey(draft.checkOut),
      };
    }
  } catch {
    return null;
  }

  return null;
}

export function savePaymentDraft(draft: PaymentDraft) {
  sessionStorage.setItem(paymentDraftKey, JSON.stringify(draft));
}

export function loadPaymentDraft(): PaymentDraft | null {
  const raw = sessionStorage.getItem(paymentDraftKey);
  if (!raw) return null;

  try {
    const draft = JSON.parse(raw) as Partial<PaymentDraft>;
    if (
      typeof draft.residence === "string" &&
      typeof draft.nights === "number" &&
      Number.isFinite(draft.nights) &&
      typeof draft.guests === "number" &&
      Number.isFinite(draft.guests) &&
      typeof draft.total === "number" &&
      Number.isFinite(draft.total) &&
      typeof draft.windowStartedAt === "number" &&
      Number.isFinite(draft.windowStartedAt) &&
      typeof draft.windowExpiresAt === "number" &&
      Number.isFinite(draft.windowExpiresAt)
    ) {
      return draft as PaymentDraft;
    }
  } catch {
    return null;
  }

  return null;
}

export function clearPaymentDraft() {
  sessionStorage.removeItem(paymentDraftKey);
}
