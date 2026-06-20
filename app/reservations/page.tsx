import type { Metadata } from "next";
import { ReservationDateRange } from "@/components/reservation-date-range";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Residences & Availability",
  description:
    "Choose a private two or three-bedroom residence and request your preferred stay dates.",
};

export default function ReservationsPage() {
  return (
    <div className="editorial-grid py-16 sm:py-24">
      <Reveal>
        <div className="grid gap-10 border-b border-black/15 pb-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
          <SectionHeading
            eyebrow="Request a stay"
            title="Choose the space. Settle on the dates."
            body="A guided request with clear pricing, a 10-minute reservation window, and personal confirmation before the booking becomes final."
            as="h1"
          />
          <p className="max-w-md text-sm leading-7 text-[#746f65] lg:justify-self-end">
            Your selected dates receive a 10-minute temporary hold when the
            request is created. If it ends, you may still submit payment proof,
            but only admin confirmation creates a final date lock.
          </p>
        </div>
      </Reveal>

      <Reveal delay={0.08} className="mt-10">
        <ReservationDateRange />
      </Reveal>
    </div>
  );
}
