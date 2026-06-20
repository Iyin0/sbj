import type { Metadata } from "next";
import { KycForm } from "@/components/kyc-form";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Guest Verification",
  description:
    "Complete private primary-guest verification for a Stay By Jordan reservation.",
};

export default function KycPage() {
  return (
    <div className="editorial-grid py-16 sm:py-24">
      <Reveal>
        <div className="grid gap-10 border-b border-black/15 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <SectionHeading
            eyebrow="Guest verification"
            title="Private, purposeful, and kept to the essentials."
            body="A short two-step verification for the primary guest. No unnecessary questions and no public-facing personal information."
            as="h1"
          />
          <p className="max-w-md text-sm leading-7 text-[#746f65] lg:justify-self-end">
            Complete this after payment proof has been submitted. Our admin team will
            review both together before confirming the stay.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.08} className="mt-10">
        <KycForm />
      </Reveal>
    </div>
  );
}
