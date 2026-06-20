import type { Metadata } from "next";
import Image from "next/image";
import {
  ArrowRightIcon,
  ArrowsOutIcon,
  EyeIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Badge, LayerCard, LinkButton } from "@cloudflare/kumo";
import { Reveal } from "@/components/reveal";
import { walkthroughUrl } from "@/lib/site-data";

export const metadata: Metadata = {
  title: "Virtual Walkthrough",
  description:
    "Explore the Stay By Jordan residence through an interactive 360-degree walkthrough.",
};

export default function VisualizationPage() {
  return (
    <div className="bg-[#171611] text-white">
      <section className="editorial-grid py-16 sm:py-24">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow text-[#d9967f]!">Virtual walkthrough</p>
              <h1 className="font-display mt-7 max-w-5xl text-[clamp(4.5rem,9vw,9rem)] font-medium leading-[0.8] tracking-[-0.055em]">
                Step inside
                <span className="block italic text-[#d9967f]">before you arrive.</span>
              </h1>
            </div>
            <div className="lg:pb-3">
              <p className="max-w-lg text-base leading-8 text-white/58">
                Look around freely, understand the flow of the residence, and
                move into date selection only when the space feels right.
              </p>
              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <LinkButton
                  href={walkthroughUrl}
                  external
                  variant="secondary"
                  className="h-12! rounded-lg! bg-[#fbfaf6]! px-5! text-xs! font-bold! uppercase! tracking-[0.16em]! text-[#181713]! hover:bg-[#d9967f]!"
                >
                  Open full screen
                </LinkButton>
                <LinkButton
                  href="/reservations"
                  variant="outline"
                  className="h-12! rounded-lg! border-white/25! px-5! text-xs! font-bold! uppercase! tracking-[0.16em]! text-white! hover:bg-white! hover:text-[#181713]!"
                >
                  Check dates
                </LinkButton>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section className="px-3 pb-3 sm:px-5 sm:pb-5">
        <Reveal>
          <LayerCard className="relative overflow-hidden! rounded-2xl! bg-black! shadow-none! ring-white/12!">
            <div className="flex items-center justify-between border-b border-white/12 px-4 py-3 sm:px-5">
              <div className="flex items-center gap-3">
                <span className="flex h-2 w-2 rounded-full bg-[#d9967f]" />
                <span className="text-[0.6rem] font-bold uppercase tracking-[0.18em] text-white/46">
                  Live residence preview
                </span>
              </div>
              <div className="flex items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.16em] text-white/38">
                <ArrowsOutIcon size={14} />
                Drag to look around
              </div>
            </div>
            <iframe
              src={walkthroughUrl}
              title="Stay By Jordan interactive residence walkthrough"
              loading="eager"
              referrerPolicy="strict-origin-when-cross-origin"
              allow="fullscreen; autoplay; clipboard-read; clipboard-write; encrypted-media; xr-spatial-tracking"
              allowFullScreen
              className="h-[72svh] min-h-[34rem] w-full border-0 bg-[#25231c]"
            />
          </LayerCard>
        </Reveal>
      </section>

      <section className="editorial-grid py-24 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <Reveal className="relative aspect-[4/3] overflow-hidden">
            <Image
              src="/images/walkthrough-media.png"
              alt="A second angle from the apartment walkthrough"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover object-top"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
            <Badge
              variant="outline"
              className="absolute bottom-5 left-5 rounded-md! border-white/40! bg-black/15! text-[0.62rem]! font-bold! uppercase! tracking-[0.18em]! text-white!"
            >
              Actual walkthrough view
            </Badge>
          </Reveal>
          <Reveal delay={0.08}>
            <EyeIcon size={28} className="text-[#d9967f]" />
            <h2 className="font-display mt-7 text-[clamp(3.5rem,7vw,7rem)] font-medium leading-[0.84] tracking-[-0.05em]">
              Seen enough?
              <span className="block italic text-[#d9967f]">Make it yours.</span>
            </h2>
            <p className="mt-7 max-w-xl text-base leading-8 text-white/56">
              Select the residence and dates that suit your stay. The payment
              timer only begins after you complete the request.
            </p>
            <LinkButton
              href="/reservations"
              variant="secondary"
              className="mt-8 h-12! rounded-lg! bg-[#fbfaf6]! px-6! text-xs! font-bold! uppercase! tracking-[0.16em]! text-[#181713]! hover:bg-[#d9967f]!"
            >
              Continue to availability
              <ArrowRightIcon size={15} />
            </LinkButton>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
