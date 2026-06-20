import type { Metadata } from "next";
import {
  CalendarCheckIcon,
  ClockIcon,
  HouseLineIcon,
  ReceiptIcon,
  ShieldCheckIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { LayerCard, LinkButton } from "@cloudflare/kumo";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import {
  phoneNumber,
  phoneUrl,
  whatsappUrl,
} from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Guest Policies & House Rules",
  description:
    "Read Stay By Jordan cancellation terms, refund policy, house rules, check-in and check-out information, and reservation guidance.",
};

const stayHighlights = [
  {
    icon: ClockIcon,
    label: "Check-in",
    value: "From 2:00 PM",
    detail: "Early arrival is subject to prior approval and availability.",
  },
  {
    icon: ClockIcon,
    label: "Check-out",
    value: "By 12:00 PM",
    detail: "Late departure must be arranged in advance and may attract a fee.",
  },
  {
    icon: UsersThreeIcon,
    label: "Occupancy",
    value: "Registered guests only",
    detail: "Visitors and additional overnight guests require prior approval.",
  },
  {
    icon: HouseLineIcon,
    label: "Quiet hours",
    value: "10:00 PM–7:00 AM",
    detail: "Please protect the comfort and privacy of neighbouring residents.",
  },
];

const cancellationTerms = [
  {
    timing: "Before admin confirmation",
    refund: "Full refund",
    detail:
      "A payment submission is not a confirmed booking. If you cancel before the admin confirms your dates, accommodation payments received will be returned in full.",
  },
  {
    timing: "7 or more days before check-in",
    refund: "Full accommodation refund",
    detail:
      "Confirmed reservations cancelled at least seven full days before check-in are eligible for a full accommodation refund.",
  },
  {
    timing: "3–6 days before check-in",
    refund: "50% accommodation refund",
    detail:
      "Confirmed reservations cancelled between three and six full days before check-in are eligible for a 50% accommodation refund.",
  },
  {
    timing: "Less than 72 hours or no-show",
    refund: "Non-refundable",
    detail:
      "Accommodation charges are non-refundable for late cancellations, no-shows, or unused nights after check-in.",
  },
];

const houseRules = [
  "No smoking or vaping inside the residence. Any specialist cleaning or damage caused may be deducted from the caution fee.",
  "No parties, events, commercial shoots, or disruptive gatherings without prior written approval.",
  "Only registered guests may stay overnight. Do not exceed the confirmed occupancy or share access codes, keys, or entry credentials.",
  "Pets are only permitted where written approval has been given before arrival.",
  "Respect quiet hours, neighbours, estate rules, shared areas, parking instructions, and on-site security guidance.",
  "Illegal activity, dangerous conduct, weapons, and open flames are not permitted in the residence.",
  "Please report damage, breakage, maintenance concerns, or lost access items promptly rather than attempting repairs.",
  "Furniture, electronics, artwork, linens, and household items must remain in the residence and be used with reasonable care.",
];

const practicalInformation = [
  {
    title: "Arrival and identity",
    body: "Arrival instructions are shared after confirmation. The primary guest may be asked to present a valid government-issued ID at check-in, and must be present unless another arrangement is approved in writing.",
  },
  {
    title: "Early arrival and late departure",
    body: "Requests should be made at least 24 hours in advance. Approval depends on neighbouring reservations and cleaning schedules, and an additional charge may apply.",
  },
  {
    title: "Caution fee and damages",
    body: "Any refundable caution fee is held separately from accommodation charges. After checkout and inspection, it is normally returned within two business days, less any documented cost for damage, missing items, exceptional cleaning, or lost access devices.",
  },
  {
    title: "Utilities and maintenance",
    body: "Please contact the host promptly if a utility, appliance, or service needs attention. Reasonable access may be required for urgent maintenance, with notice whenever circumstances allow.",
  },
  {
    title: "Personal belongings",
    body: "Guests are responsible for securing valuables and checking the residence before departure. We will make reasonable efforts to help recover forgotten items, but collection or delivery costs remain the guest’s responsibility.",
  },
  {
    title: "Extensions and date changes",
    body: "Extra nights and date changes are subject to availability and written approval. Until approved and paid for, the original confirmed checkout time remains in effect.",
  },
];

export default function PoliciesPage() {
  return (
    <div>
      <section className="editorial-grid py-20 sm:py-28">
        <Reveal>
          <div className="grid gap-12 border-b border-black/15 pb-14 lg:grid-cols-[1.18fr_0.82fr] lg:items-end">
            <SectionHeading
              eyebrow="Guest guide"
              title="Clear expectations make for an easier stay."
              body="Everything to know about reservation timing, cancellations, refunds, arrival, departure, and caring for the residence."
              as="h1"
            />
            <p className="max-w-md text-sm leading-7 text-[#746f65] lg:justify-self-end">
                These standard terms apply unless a different arrangement is
                included in your written confirmation. Please review them before
                making a payment.
            </p>
          </div>
        </Reveal>
      </section>

      <section className="editorial-grid pb-24 sm:pb-32">
        <div className="grid gap-px overflow-hidden rounded-2xl bg-black/12 md:grid-cols-2 xl:grid-cols-4">
          {stayHighlights.map((item, index) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={index * 0.05} className="h-full">
                <LayerCard className="h-full rounded-none! bg-[#fbfaf6]! p-6 shadow-none! ring-0! sm:p-8">
                  <Icon size={23} className="text-[#9c3f28]" />
                  <p className="mt-8 text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[#746f65]">
                    {item.label}
                  </p>
                  <h2 className="font-display mt-3 text-3xl font-medium">
                    {item.value}
                  </h2>
                  <p className="mt-4 text-sm leading-7 text-[#746f65]">
                    {item.detail}
                  </p>
                </LayerCard>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="bg-[#181713] py-24 text-white sm:py-32">
        <div className="editorial-grid">
          <div className="grid gap-14 lg:grid-cols-[0.72fr_1.28fr]">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <p className="eyebrow text-[#d9967f]!">Reservation status</p>
                <h2 className="font-display mt-6 text-5xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                  A request is not a confirmed booking.
                </h2>
              </div>
            </Reveal>
            <Reveal delay={0.08}>
              <div className="grid gap-px bg-white/14">
                {[
                  [
                    "01",
                    "The 10-minute window",
                    "The temporary window begins when your reservation request is created. During those ten minutes, the selected dates are held from new requests.",
                  ],
                  [
                    "02",
                    "When the window ends",
                    "The temporary hold is released and the dates become available again. You may still transfer and submit proof, but availability is no longer assured.",
                  ],
                  [
                    "03",
                    "The true date lock",
                    "Only an admin confirmation creates a final lock. Payment proof alone does not guarantee the dates, including when it was submitted inside the ten-minute window.",
                  ],
                  [
                    "04",
                    "If the dates are no longer available",
                    "If Stay By Jordan cannot confirm the requested dates, payments received for that request will be refunded in full or moved to new dates with your agreement.",
                  ],
                ].map(([number, title, body]) => (
                  <div
                    key={number}
                    className="grid gap-5 bg-[#181713] py-7 sm:grid-cols-[4rem_1fr]"
                  >
                    <span className="font-display text-3xl text-[#d9967f]">
                      {number}
                    </span>
                    <div>
                      <h3 className="font-display text-3xl font-medium">
                        {title}
                      </h3>
                      <p className="mt-3 max-w-2xl text-sm leading-7 text-white/56">
                        {body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="editorial-grid py-24 sm:py-32">
        <Reveal>
          <div className="flex items-end gap-5">
            <ReceiptIcon size={28} className="mb-2 text-[#9c3f28]" />
            <div>
              <p className="eyebrow">Cancellations and refunds</p>
              <h2 className="font-display mt-5 text-5xl font-medium tracking-[-0.04em] sm:text-6xl">
                Our standard cancellation schedule.
              </h2>
            </div>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-black/12">
          {cancellationTerms.map((term, index) => (
            <Reveal key={term.timing} delay={index * 0.05}>
              <LayerCard className="grid rounded-none! bg-[#fbfaf6]! p-6 shadow-none! ring-0! md:grid-cols-[0.72fr_0.48fr_1.3fr] md:items-center md:gap-8 sm:p-8">
                <h3 className="font-display text-3xl font-medium">
                  {term.timing}
                </h3>
                <p className="mt-3 text-[0.66rem] font-bold uppercase tracking-[0.16em] text-[#9c3f28] md:mt-0">
                  {term.refund}
                </p>
                <p className="mt-4 text-sm leading-7 text-[#746f65] md:mt-0">
                  {term.detail}
                </p>
              </LayerCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.08}>
          <LayerCard className="mt-5 rounded-xl! bg-[#e9e3d9]! p-6 shadow-none! ring-black/10! sm:p-8">
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-display text-3xl font-medium">
                  How refunds are handled
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#625d54]">
                  Approved refunds are normally initiated within 5–10 business
                  days after we receive the correct repayment details. Your bank
                  may take additional time to credit the funds.
                </p>
              </div>
              <div>
                <h3 className="font-display text-3xl font-medium">
                  Exceptional circumstances
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#625d54]">
                  We review serious emergencies and service interruptions
                  fairly. Any exception, credit, or date move must be confirmed
                  in writing by the admin team.
                </p>
              </div>
            </div>
          </LayerCard>
        </Reveal>
      </section>

      <section className="bg-[#e9e3d9] py-24 sm:py-32">
        <div className="editorial-grid">
          <div className="grid gap-14 lg:grid-cols-[0.75fr_1.25fr]">
            <Reveal>
              <div className="lg:sticky lg:top-28">
                <ShieldCheckIcon size={28} className="text-[#9c3f28]" />
                <h2 className="font-display mt-6 text-5xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                  House rules.
                </h2>
                <p className="mt-5 max-w-sm text-sm leading-7 text-[#746f65]">
                  The residences sit within lived-in communities. These rules
                  protect guests, neighbours, staff, and the homes themselves.
                </p>
              </div>
            </Reveal>
            <div className="grid gap-3">
              {houseRules.map((rule, index) => (
                <Reveal key={rule} delay={index * 0.035}>
                  <LayerCard className="grid grid-cols-[2.5rem_1fr] gap-4 rounded-xl! bg-[#fbfaf6]! p-5 shadow-none! ring-black/10! sm:p-6">
                    <span className="font-display text-2xl text-[#9c3f28]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="text-sm leading-7 text-[#625d54]">{rule}</p>
                  </LayerCard>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-grid py-24 sm:py-32">
        <Reveal>
          <div className="flex items-end gap-5">
            <CalendarCheckIcon size={28} className="mb-2 text-[#9c3f28]" />
            <div>
              <p className="eyebrow">During your stay</p>
              <h2 className="font-display mt-5 text-5xl font-medium tracking-[-0.04em] sm:text-6xl">
                Practical information.
              </h2>
            </div>
          </div>
        </Reveal>
        <div className="mt-10 grid gap-px overflow-hidden rounded-2xl bg-black/12 md:grid-cols-2">
          {practicalInformation.map((item, index) => (
            <Reveal key={item.title} delay={index * 0.045} className="h-full">
              <LayerCard className="h-full rounded-none! bg-[#fbfaf6]! p-7 shadow-none! ring-0! sm:p-9">
                <h3 className="font-display text-3xl font-medium">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[#746f65]">
                  {item.body}
                </p>
              </LayerCard>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="editorial-grid pb-24 sm:pb-32">
        <Reveal>
          <LayerCard className="rounded-2xl! bg-[#181713]! p-7 text-white soft-shadow ring-0! sm:p-12">
            <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
              <div>
                <p className="eyebrow text-[#d9967f]!">Need clarification?</p>
                <h2 className="font-display mt-6 text-5xl font-medium leading-[0.9] tracking-[-0.04em] sm:text-6xl">
                  Ask before you reserve.
                </h2>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-white/58">
                  If your plans involve extra visitors, an event, a pet, an
                  unusual arrival time, or another special request, contact us
                  before making payment so we can confirm what is possible.
                </p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:justify-end">
                <LinkButton
                  href={whatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  variant="secondary"
                  className="h-12! rounded-lg! bg-[#fbfaf6]! px-6! text-xs! font-bold! uppercase! tracking-[0.14em]! text-[#181713]! hover:bg-[#d9967f]!"
                >
                  WhatsApp us
                </LinkButton>
                <LinkButton
                  href={phoneUrl}
                  variant="outline"
                  className="h-12! rounded-lg! border-white/25! px-6! text-xs! font-bold! uppercase! tracking-[0.14em]! text-white! hover:bg-white/10!"
                >
                  Call {phoneNumber}
                </LinkButton>
              </div>
            </div>
          </LayerCard>
        </Reveal>
      </section>
    </div>
  );
}
