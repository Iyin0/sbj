import {
  ArrowUpRightIcon,
  GaugeIcon,
  InstagramLogoIcon,
  PhoneIcon,
  WhatsappLogoIcon,
} from "@phosphor-icons/react/dist/ssr";
import { Link, LinkButton } from "@cloudflare/kumo";
import { CurrentYear } from "@/components/current-year";
import {
  instagramHandle,
  instagramUrl,
  navItems,
  phoneNumber,
  phoneUrl,
  whatsappUrl,
} from "@/lib/site-data";

export function SiteFooter() {
  return (
    <footer className="bg-[#171611] text-[#fbfaf6]">
      <div className="editorial-grid">
        <div className="border-b border-white/12 py-16 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
            <div>
              <p className="eyebrow text-[#d9967f]!">Your next stay</p>
              <h2 className="font-display mt-6 max-w-4xl text-[clamp(3.7rem,8vw,8rem)] font-medium leading-[0.82] tracking-[-0.055em]">
                Arrive somewhere that already feels considered.
              </h2>
            </div>
            <div className="lg:pb-3">
              <p className="max-w-md text-base leading-8 text-white/58">
                Select your residence and dates. We will review the request and
                guide you through the rest personally.
              </p>
              <LinkButton
                href="/reservations"
                variant="secondary"
                className="mt-7 h-12! rounded-lg! bg-[#fbfaf6]! px-6! text-xs! font-bold! uppercase! tracking-[0.18em]! text-[#181713]! hover:bg-[#d9967f]!"
              >
                Check availability
              </LinkButton>
            </div>
          </div>
        </div>

        <div className="grid gap-12 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div>
            <Link
              href="/"
              variant="plain"
              className="font-display text-3xl font-semibold text-[#fbfaf6]!"
            >
              Stay By Jordan
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-7 text-white/48">
              Private apartment stays for guests who value space, discretion,
              and a more personal standard of hospitality.
            </p>
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#d9967f]">
              Explore
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/58">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  variant="plain"
                  className="text-white/58! hover:text-white!"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/payment"
                variant="plain"
                className="text-white/58! hover:text-white!"
              >
                Payment
              </Link>
            </div>
          </div>
          <div>
            <p className="text-[0.65rem] font-bold uppercase tracking-[0.22em] text-[#d9967f]">
              Connect
            </p>
            <div className="mt-5 grid gap-3 text-sm text-white/58">
              <Link
                href={instagramUrl}
                variant="plain"
                target="_blank"
                rel="noreferrer"
                className="flex! items-center! gap-2! text-white/58! hover:text-white!"
              >
                <InstagramLogoIcon size={16} />
                {instagramHandle}
                <ArrowUpRightIcon size={14} />
              </Link>
              <Link
                href={whatsappUrl}
                variant="plain"
                target="_blank"
                rel="noreferrer"
                className="flex! items-center! gap-2! text-white/58! hover:text-white!"
              >
                <WhatsappLogoIcon size={16} />
                WhatsApp
                <ArrowUpRightIcon size={14} />
              </Link>
              <Link
                href={phoneUrl}
                variant="plain"
                className="flex! items-center! gap-2! text-white/58! hover:text-white!"
              >
                <PhoneIcon size={16} />
                {phoneNumber}
              </Link>
              <Link
                href="/admin"
                variant="plain"
                className="flex! items-center! gap-2! text-white/58! hover:text-white!"
              >
                <GaugeIcon size={16} />
                Dash
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 border-t border-white/10 py-5 text-[0.64rem] uppercase tracking-[0.15em] text-white/34 sm:flex-row sm:justify-between">
          <p>
            © <CurrentYear /> Stay By Jordan
          </p>
          <p>Private stays · Personally confirmed</p>
        </div>
      </div>
    </footer>
  );
}
