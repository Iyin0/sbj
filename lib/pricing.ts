export type ResidenceId = "two-bedroom" | "three-bedroom";

export type ResidencePricing = Record<ResidenceId, number>;

export const defaultPricing: ResidencePricing = {
  "two-bedroom": 140_000,
  "three-bedroom": 155_000,
};

export function formatNaira(value: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(value);
}
