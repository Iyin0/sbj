"use client";

import { usePricing } from "@/components/pricing-provider";
import { formatNaira, type ResidenceId } from "@/lib/pricing";

export function ResidenceRate({
  residence,
  suffix = "per night",
}: {
  residence: ResidenceId;
  suffix?: string;
}) {
  const { pricing } = usePricing();

  return (
    <p className="shrink-0 text-sm font-semibold">
      From {formatNaira(pricing[residence])}
      <span className="block text-xs font-normal text-[#746f65]">{suffix}</span>
    </p>
  );
}
