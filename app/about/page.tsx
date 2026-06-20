import type { Metadata } from "next";
import Image from "next/image";
import {
  HeartStraightIcon,
  KeyIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Grid,
  GridItem,
  LayerCard,
  LinkButton,
} from "@cloudflare/kumo";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";

export const metadata: Metadata = {
  title: "Our Story",
  description:
    "Stay By Jordan brings the privacy of a residence together with attentive, personal hospitality.",
};

const principles = [
  {
    icon: KeyIcon,
    title: "Space that feels like yours",
    body: "A private residence gives you room to gather, work, rest, and move through the day without hotel formality.",
  },
  {
    icon: HeartStraightIcon,
    title: "Hospitality with a human rhythm",
    body: "Every request is personally considered, every arrival is coordinated, and support stays close without hovering.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Discretion by design",
    body: "Guest details, exact locations, and reservation information are shared carefully and only when appropriate.",
  },
];

export default function AboutPage() {
  return (
    <div>
      <section className="editorial-grid py-20 sm:py-32">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[0.65fr_1.35fr] lg:items-start">
            <div>
              <p className="eyebrow">Our story</p>
              <p className="font-display mt-8 text-3xl font-medium leading-[1.08] text-[#343129]">
                A stay can be temporary without ever feeling impersonal.
              </p>
            </div>
            <h1 className="font-display text-[clamp(4.5rem,9.5vw,10rem)] font-medium leading-[0.78] tracking-[-0.06em]">
              Privacy, space,
              <span className="block italic text-[#9c3f28]">and genuine care.</span>
            </h1>
          </div>
        </Reveal>
      </section>

      <section className="relative min-h-[72svh] overflow-hidden">
        <Image
          src="/images/residence-dining.jpg"
          alt="A warm dining and kitchen space in a private residence"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/5 to-transparent" />
        <div className="editorial-grid relative min-h-[72svh]">
          <Reveal className="flex items-end pb-10 sm:pb-16">
            <p className="max-w-2xl font-display text-3xl font-medium leading-tight text-white sm:text-5xl">
              “The best luxury is not display. It is the feeling that everything
              has already been thought through.”
            </p>
          </Reveal>
        </div>
      </section>

      <section className="editorial-grid py-24 sm:py-36">
        <div className="grid gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Why we exist"
              title="To make a private stay feel beautifully simple."
              body="Stay By Jordan was imagined for guests who want more than a room, but less friction than managing a rental alone."
            />
          </Reveal>
          <Reveal delay={0.08}>
            <div className="space-y-7 text-base leading-8 text-[#625d54]">
              <p>
                The residence gives you autonomy. The host gives you confidence.
                Together, they create a stay that feels grounded from the moment
                you first explore the space.
              </p>
              <p>
                We keep the reservation experience deliberately clear: see the
                property, choose dates, secure the request, verify the primary
                guest, and receive a considered confirmation.
              </p>
              <p>
                There is technology underneath that journey, but the guest
                should barely notice it. What you should notice is clarity,
                privacy, and a host who remains accountable for the experience.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e9e3d9] py-24 sm:py-32">
        <div className="editorial-grid">
          <Reveal>
            <p className="eyebrow">What guides us</p>
          </Reveal>
          <Grid
            variant="1-3up"
            gap="none"
            className="mt-10 gap-px bg-black/12"
          >
            {principles.map((principle, index) => {
              const Icon = principle.icon;
              return (
                <GridItem key={principle.title}>
                  <Reveal delay={index * 0.08} className="h-full">
                    <LayerCard className="h-full rounded-none! bg-[#fbfaf6]! p-7 shadow-none! ring-0! sm:p-10">
                      <Icon size={26} className="text-[#9c3f28]" />
                      <h2 className="font-display mt-16 text-4xl font-medium leading-[0.95]">
                        {principle.title}
                      </h2>
                      <p className="mt-5 text-sm leading-7 text-[#746f65]">
                        {principle.body}
                      </p>
                    </LayerCard>
                  </Reveal>
                </GridItem>
              );
            })}
          </Grid>
        </div>
      </section>

      <section className="editorial-grid py-24 sm:py-36">
        <div className="grid gap-10 border-y border-black/15 py-14 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <Reveal>
            <h2 className="font-display text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.84] tracking-[-0.05em]">
              Find the residence
              <span className="block italic text-[#9c3f28]">for your next chapter.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.08} className="lg:justify-self-end">
            <p className="max-w-md text-sm leading-7 text-[#746f65]">
              Walk through the space first or move directly into availability.
              The process stays clear either way.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <LinkButton
                href="/visualization"
                variant="outline"
                className="h-12! rounded-lg! border-black/20! px-6! text-xs! font-bold! uppercase! tracking-[0.16em]! text-[#181713]!"
              >
                View walkthrough
              </LinkButton>
              <LinkButton
                href="/reservations"
                variant="primary"
                className="h-12! rounded-lg! bg-[#181713]! px-6! text-xs! font-bold! uppercase! tracking-[0.16em]! text-white! hover:bg-[#9c3f28]!"
              >
                Check availability
              </LinkButton>
            </div>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
