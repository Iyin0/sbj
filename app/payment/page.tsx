import type { Metadata } from "next";
import { PaymentPanel } from "@/components/payment-panel";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Secure Your Stay",
  description:
    "Complete the 10-minute reservation payment step and submit payment proof for your Stay By Jordan request.",
};

export default function PaymentPage() {
  return (
    <div className="editorial-grid py-16 sm:py-24">
      <Reveal>
        <div className="grid gap-10 border-b border-black/15 pb-14 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <SectionHeading
            eyebrow="10-minute reservation"
            title="Your temporary hold lasts for 10 minutes."
            body="The timer began when your request was created. If it ends, your dates unlock, but you can still transfer and submit proof for admin review."
            as="h1"
          />
          <p className="max-w-md text-sm leading-7 text-[#746f65] lg:justify-self-end">
            Payment proof does not create a final booking. Your dates are only
            truly locked after the admin team confirms them.
          </p>
        </div>
      </Reveal>
      <Reveal delay={0.08} className="mt-10">
        <PaymentPanel />
      </Reveal>
    </div>
  );
}
