import Image from "next/image";
import {
  ArrowDownIcon,
  ArrowRightIcon,
  BedIcon,
  EyeIcon,
  MapPinIcon,
  UsersThreeIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Badge,
  Grid,
  GridItem,
  LayerCard,
  Link,
  LinkButton,
} from "@cloudflare/kumo";
import { QuickBooking } from "@/components/quick-booking";
import { Reveal } from "@/components/reveal";
import { ReservationLink } from "@/components/reservation-link";
import { ResidenceRate } from "@/components/residence-rate";
import { SectionHeading } from "@/components/section-heading";
import {
  apartmentTypes,
  bookingSteps,
  servicePromises,
} from "@/lib/site-data";
import type { ResidenceId } from "@/lib/pricing";

export default function Home() {
  return (
    <div>
      <section className="relative min-h-[calc(100svh-4.6rem)] overflow-hidden bg-[#171611] text-white">
        <Image
          src="/images/hero-residence.jpg"
          alt="A spacious contemporary residence with warm natural materials"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(15,14,11,0.78)_0%,rgba(15,14,11,0.34)_52%,rgba(15,14,11,0.08)_100%),linear-gradient(0deg,rgba(15,14,11,0.62)_0%,transparent_45%)]" />

        <div className="page-gutter relative z-10 mx-auto flex min-h-[calc(100svh-4.6rem)] max-w-[100rem] flex-col justify-between py-8 sm:py-12">
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="rounded-md! border-white/35! bg-black/10! px-3! py-1.5! text-[0.62rem]! font-bold! uppercase! tracking-[0.22em]! text-white!"
            >
              Private apartment stays
            </Badge>
            <Link
              href="#welcome"
              variant="plain"
              className="hidden! items-center gap-3 text-[0.63rem] font-bold uppercase tracking-[0.2em] text-white/68! sm:flex!"
            >
              Discover
              <span className="grid h-9 w-9 place-items-center rounded-full border border-white/30">
                <ArrowDownIcon size={14} />
              </span>
            </Link>
          </div>

          <div className="pb-8 pt-20 sm:pb-12">
            <Reveal>
              <p className="eyebrow text-[#efb39f]!">Stay beautifully. Live privately.</p>
              <h1 className="font-display mt-7 max-w-5xl text-[clamp(4.8rem,10.5vw,10.5rem)] font-medium leading-[0.77] tracking-[-0.06em] text-[#fbfaf6]">
                Your own space,
                <span className="block italic">thoughtfully hosted.</span>
              </h1>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="mt-9 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <p className="max-w-xl text-base leading-8 text-white/70 sm:text-lg">
                  Two considered residences in Abuja for short stays that feel
                  less temporary—more space, more discretion, and a personal
                  path from first look to arrival.
                </p>
                <LinkButton
                  href="/visualization"
                  variant="outline"
                  className="h-12! w-fit! rounded-lg! border-white/45! bg-black/10! px-5! text-[0.68rem]! font-bold! uppercase! tracking-[0.18em]! text-white! hover:bg-white! hover:text-[#181713]!"
                >
                  Take the walkthrough
                </LinkButton>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="editorial-grid relative z-20 -mt-1 bg-[#f3f0e9]">
        <div className="-mt-8 pb-24 sm:-mt-12 sm:pb-32">
          <QuickBooking />
        </div>
      </section>

      <section id="welcome" className="editorial-grid overflow-hidden py-24 sm:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.78fr_1.22fr] lg:items-start">
          <Reveal>
            <p className="eyebrow">Stay By Jordan</p>
            <p className="font-display mt-8 text-3xl font-medium leading-[1.08] tracking-[-0.025em] text-[#343129] sm:text-4xl">
              A quieter, more personal expression of short-stay hospitality.
            </p>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="font-display text-[clamp(3.7rem,7vw,7.6rem)] font-medium leading-[0.84] tracking-[-0.05em]">
              The freedom of an apartment.
              <span className="block italic text-[#9c3f28]">
                The care of a private host.
              </span>
            </h2>
            <div className="mt-10 grid gap-8 border-t border-black/15 pt-8 sm:grid-cols-2">
              <p className="text-base leading-8 text-[#746f65]">
                Every detail is arranged to remove friction: preview the space,
                select your stay, complete verification, and receive a personally
                confirmed reservation.
              </p>
              <p className="text-base leading-8 text-[#746f65]">
                The experience is intentionally discreet. Exact location and
                arrival details are shared at the right moment, with direct
                support when you need it.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#e9e3d9] py-24 sm:py-36">
        <div className="editorial-grid">
          <Reveal>
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <SectionHeading
                eyebrow="The residences"
                title="Choose the space that fits the stay."
                body="Two distinct ways to settle in, each with generous living areas and a reservation personally reviewed before confirmation."
              />
              <Link
                href="/reservations"
                variant="plain"
                className="luxury-link w-fit text-xs font-bold uppercase tracking-[0.18em] text-[#9c3f28]!"
              >
                Compare availability
              </Link>
            </div>
          </Reveal>

          <Grid variant="2up" gap="base" className="mt-16">
            {apartmentTypes.map((apartment, index) => (
              <GridItem key={apartment.id}>
                <Reveal delay={index * 0.08}>
                  <LayerCard
                    render={<article />}
                    className="group overflow-hidden! rounded-2xl! bg-[#fbfaf6]! shadow-none! ring-0!"
                  >
                  <ReservationLink
                    residence={apartment.id as "two-bedroom" | "three-bedroom"}
                    className="relative block! aspect-[4/3] overflow-hidden text-current!"
                  >
                    <Image
                      src={apartment.image}
                      alt={apartment.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 50vw, 100vw"
                      className="object-cover transition duration-1000 ease-out group-hover:scale-[1.035]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/46 via-transparent to-transparent" />
                    <span className="absolute bottom-5 right-5 grid h-12 w-12 place-items-center rounded-full bg-[#fbfaf6] text-[#181713] transition duration-500 group-hover:bg-[#9c3f28] group-hover:text-white">
                      <ArrowRightIcon size={18} />
                    </span>
                  </ReservationLink>
                  <div className="p-6 sm:p-8">
                    <p className="text-[0.64rem] font-bold uppercase tracking-[0.2em] text-[#9c3f28]">
                      {apartment.eyebrow}
                    </p>
                    <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                      <div>
                        <h3 className="font-display text-5xl font-medium tracking-[-0.04em]">
                          {apartment.name}
                        </h3>
                        <p className="mt-4 max-w-lg text-sm leading-7 text-[#746f65]">
                          {apartment.summary}
                        </p>
                        <p className="mt-4 flex max-w-lg items-start gap-2 text-xs leading-6 text-[#625d54]">
                          <MapPinIcon size={15} className="mt-1 shrink-0 text-[#9c3f28]" />
                          {apartment.address}
                        </p>
                      </div>
                      <ResidenceRate
                        residence={apartment.id as ResidenceId}
                        suffix={apartment.rateSuffix}
                      />
                    </div>
                    <div className="mt-7 flex flex-wrap gap-5 border-t border-black/10 pt-5 text-xs font-semibold text-[#514d45]">
                      <span className="flex items-center gap-2">
                        <BedIcon size={16} />
                        {apartment.bedrooms}
                      </span>
                      <span className="flex items-center gap-2">
                        <UsersThreeIcon size={16} />
                        {apartment.capacity}
                      </span>
                    </div>
                  </div>
                  </LayerCard>
                </Reveal>
              </GridItem>
            ))}
          </Grid>
        </div>
      </section>

      <section className="editorial-grid py-24 sm:py-36">
        <div className="grid gap-14 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Reveal className="relative">
            <div className="relative aspect-[4/5] overflow-hidden bg-[#d8d0c3]">
              <Image
                src="/images/walkthrough-preview.png"
                alt="A preview from the interactive apartment walkthrough"
                fill
                sizes="(min-width: 1024px) 46vw, 100vw"
                className="object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              <Badge
                variant="outline"
                className="absolute left-5 top-5 rounded-md! border-white/45! bg-black/15! text-[0.62rem]! font-bold! uppercase! tracking-[0.2em]! text-white!"
              >
                Interactive preview
              </Badge>
              <Link
                href="/visualization"
                variant="plain"
                className="absolute bottom-6 left-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.18em] text-white!"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full border border-white/50 bg-black/20 backdrop-blur">
                  <EyeIcon size={18} />
                </span>
                Enter the residence
              </Link>
            </div>
            <div className="absolute -bottom-7 -right-3 hidden w-40 bg-[#9c3f28] p-6 text-white sm:block">
              <p className="font-display text-4xl">360°</p>
              <p className="mt-2 text-[0.62rem] font-bold uppercase tracking-[0.18em] text-white/66">
                Walkthrough
              </p>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <SectionHeading
              eyebrow="See it for yourself"
              title="Walk through before you commit."
              body="Move through the residence at your own pace. Understand the layout, atmosphere, and details before starting a reservation."
            />
            <div className="mt-10 grid gap-6 border-t border-black/15 pt-8 sm:grid-cols-2">
              <div>
                <p className="font-display text-3xl">Explore freely</p>
                <p className="mt-3 text-sm leading-7 text-[#746f65]">
                  Look around the living areas and get a genuine feel for the
                  space from wherever you are.
                </p>
              </div>
              <div>
                <p className="font-display text-3xl">Reserve confidently</p>
                <p className="mt-3 text-sm leading-7 text-[#746f65]">
                  Move from the walkthrough into date selection without losing
                  the calm, considered rhythm of the experience.
                </p>
              </div>
            </div>
            <LinkButton
              href="/visualization"
              variant="primary"
              className="mt-9 h-12! rounded-lg! bg-[#181713]! px-6! text-xs! font-bold! uppercase! tracking-[0.18em]! text-white! hover:bg-[#9c3f28]!"
            >
              Open virtual walkthrough
            </LinkButton>
          </Reveal>
        </div>
      </section>

      <section className="bg-[#171611] py-24 text-white sm:py-36">
        <div className="editorial-grid">
          <Reveal>
            <SectionHeading
              eyebrow="The Stay By Jordan standard"
              title="Luxury is how little you have to think about."
              body="A premium stay should feel clear, calm, and attentive from the first interaction—not complicated for the sake of appearing exclusive."
              tone="dark"
            />
          </Reveal>
          <Grid
            variant="1-3up"
            gap="none"
            className="mt-16 border-y border-white/12"
          >
            {servicePromises.map((promise, index) => (
              <GridItem key={promise.number}>
                <Reveal
                  delay={index * 0.08}
                  className="h-full border-b border-white/12 p-7 last:border-b-0 lg:border-b-0 lg:border-r lg:last:border-r-0 sm:p-10"
                >
                  <p className="font-display text-2xl text-[#d9967f]">{promise.number}</p>
                  <h3 className="font-display mt-16 text-4xl font-medium tracking-[-0.03em]">
                    {promise.title}
                  </h3>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-white/52">
                    {promise.body}
                  </p>
                </Reveal>
              </GridItem>
            ))}
          </Grid>
        </div>
      </section>

      <section className="editorial-grid py-24 sm:py-36">
        <Reveal>
          <SectionHeading
            eyebrow="From request to arrival"
            title="Four clear steps. No guesswork."
            body="The flow is designed to protect the stay without making the guest experience feel procedural."
          />
        </Reveal>
        <Grid
          variant="1-2-4up"
          gap="none"
          className="mt-16 gap-px bg-black/12"
        >
          {bookingSteps.map((step, index) => (
            <GridItem key={step.number}>
              <Reveal delay={index * 0.06} className="h-full">
                <LayerCard className="h-full rounded-none! bg-[#f3f0e9]! p-6 shadow-none! ring-0! sm:p-8">
                  <p className="font-display text-5xl text-[#9c3f28]">{step.number}</p>
                  <h3 className="font-display mt-14 text-3xl font-medium leading-tight">
                    {step.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[#746f65]">{step.body}</p>
                </LayerCard>
              </Reveal>
            </GridItem>
          ))}
        </Grid>
      </section>
    </div>
  );
}
