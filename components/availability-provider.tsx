"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DateRange } from "@cloudflare/kumo";
import {
  enumerateDateRange,
  fromDateKey,
  toDateKey,
} from "@/lib/date-utils";

const storageKey = "sbj-blocked-reservation-dates";

const defaultBlockedDateKeys = [
  "2026-07-05",
  "2026-07-06",
  "2026-07-16",
  "2026-07-17",
  "2026-07-18",
  "2026-07-28",
  "2026-08-09",
  "2026-08-10",
];

type AvailabilityContextValue = {
  blockedDateKeys: string[];
  blockedDates: Date[];
  blockRange: (range: DateRange) => void;
  removeBlockedDate: (dateKey: string) => void;
  clearBlockedDates: () => void;
};

const AvailabilityContext = createContext<AvailabilityContextValue | null>(
  null,
);

export function AvailabilityProvider({ children }: { children: ReactNode }) {
  const [blockedDateKeys, setBlockedDateKeys] = useState(
    defaultBlockedDateKeys,
  );

  useEffect(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem(storageKey) ?? "null",
      ) as unknown;
      if (
        Array.isArray(stored) &&
        stored.every(
          (value) =>
            typeof value === "string" &&
            /^\d{4}-\d{2}-\d{2}$/.test(value),
        )
      ) {
        const timer = window.setTimeout(() => setBlockedDateKeys(stored), 0);
        return () => window.clearTimeout(timer);
      }
    } catch {
      localStorage.removeItem(storageKey);
    }
  }, []);

  function save(next: string[]) {
    const sorted = [...new Set(next)].sort();
    setBlockedDateKeys(sorted);
    localStorage.setItem(storageKey, JSON.stringify(sorted));
  }

  const value = useMemo<AvailabilityContextValue>(
    () => ({
      blockedDateKeys,
      blockedDates: blockedDateKeys.map(fromDateKey),
      blockRange(range) {
        save([
          ...blockedDateKeys,
          ...enumerateDateRange(range).map(toDateKey),
        ]);
      },
      removeBlockedDate(dateKey) {
        save(blockedDateKeys.filter((value) => value !== dateKey));
      },
      clearBlockedDates() {
        save([]);
      },
    }),
    [blockedDateKeys],
  );

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
}

export function useAvailability() {
  const context = useContext(AvailabilityContext);
  if (!context) {
    throw new Error(
      "useAvailability must be used within AvailabilityProvider",
    );
  }
  return context;
}
