import type { Metadata } from "next";
import { BellSimpleIcon } from "@phosphor-icons/react/dist/ssr";
import { Badge, LayerCard } from "@cloudflare/kumo";
import { AdminGreeting } from "@/components/admin-greeting";
import { AdminDashboard } from "@/components/admin-dashboard";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Review Stay By Jordan requests, payment proof, and guest verification.",
};

export default function AdminPage() {
  return (
    <div className="editorial-grid py-12 sm:py-16">
      <Reveal>
        <div className="flex flex-col gap-8 border-b border-black/15 pb-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <Badge
                variant="outline"
                className="rounded-md! border-black/20! bg-transparent! text-[0.62rem]! font-bold! uppercase! tracking-[0.18em]! text-[#514d45]!"
              >
                Admin workspace
              </Badge>
              <Badge variant="success" appearance="dot">
                Live operations
              </Badge>
            </div>
            <AdminGreeting />
          </div>
          <LayerCard className="flex max-w-md items-start gap-4 rounded-xl! bg-[#fbfaf6]! p-5 shadow-none! ring-black/10!">
            <BellSimpleIcon size={21} className="mt-0.5 shrink-0 text-[#9c3f28]" />
            <div>
              <p className="text-sm font-semibold">Two requests need attention</p>
              <p className="mt-1 text-xs leading-5 text-[#746f65]">
                One 10-minute reservation is active and one guest profile is ready to review.
              </p>
            </div>
          </LayerCard>
        </div>
      </Reveal>
      <Reveal delay={0.08} className="mt-8">
        <AdminDashboard />
      </Reveal>
    </div>
  );
}
