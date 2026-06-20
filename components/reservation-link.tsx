"use client";

import type { ReactNode } from "react";
import { Link } from "@cloudflare/kumo";
import { saveResidencePreference } from "@/lib/reservation-session";

export function ReservationLink({
  residence,
  className,
  children,
}: {
  residence: "two-bedroom" | "three-bedroom";
  className?: string;
  children: ReactNode;
}) {
  return (
    <Link
      href="/reservations"
      variant="plain"
      className={className}
      onClick={() => saveResidencePreference(residence)}
    >
      {children}
    </Link>
  );
}
