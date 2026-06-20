"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultPricing,
  type ResidencePricing,
} from "@/lib/pricing";

const storageKey = "sbj-residence-pricing";

type PricingContextValue = {
  pricing: ResidencePricing;
  savePricing: (pricing: ResidencePricing) => void;
};

const PricingContext = createContext<PricingContextValue | null>(null);

function isValidPrice(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0;
}

export function PricingProvider({ children }: { children: ReactNode }) {
  const [pricing, setPricing] = useState<ResidencePricing>(defaultPricing);

  useEffect(() => {
    let storedPricing: ResidencePricing | null = null;

    try {
      const stored = JSON.parse(localStorage.getItem(storageKey) ?? "null") as
        | Partial<ResidencePricing>
        | null;

      if (
        stored &&
        isValidPrice(stored["two-bedroom"]) &&
        isValidPrice(stored["three-bedroom"])
      ) {
        storedPricing = {
          "two-bedroom": stored["two-bedroom"],
          "three-bedroom": stored["three-bedroom"],
        };
      }
    } catch {
      localStorage.removeItem(storageKey);
    }

    if (!storedPricing) return;

    const timer = window.setTimeout(() => setPricing(storedPricing), 0);
    return () => window.clearTimeout(timer);
  }, []);

  const value = useMemo<PricingContextValue>(
    () => ({
      pricing,
      savePricing(nextPricing) {
        setPricing(nextPricing);
        localStorage.setItem(storageKey, JSON.stringify(nextPricing));
      },
    }),
    [pricing],
  );

  return (
    <PricingContext.Provider value={value}>{children}</PricingContext.Provider>
  );
}

export function usePricing() {
  const context = useContext(PricingContext);

  if (!context) {
    throw new Error("usePricing must be used within PricingProvider");
  }

  return context;
}
