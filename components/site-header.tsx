"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import { Button, Link, LinkButton } from "@cloudflare/kumo";
import { useState } from "react";
import { navItems } from "@/lib/site-data";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f3f0e9]/92 backdrop-blur-xl">
      <div className="page-gutter mx-auto flex h-[4.6rem] max-w-[100rem] items-center justify-between">
        <Link
          href="/"
          variant="plain"
          className="group flex! items-center gap-3 text-[#181713]!"
          onClick={() => setOpen(false)}
        >
          <span className="grid h-9 w-9 place-items-center rounded-full border border-[#181713]/25 text-[0.62rem] font-bold tracking-[0.16em] transition duration-500 group-hover:bg-[#181713] group-hover:text-[#fbfaf6]">
            SBJ
          </span>
          <span className="font-display text-xl font-semibold tracking-[-0.02em] sm:text-2xl">
            Stay By Jordan
          </span>
        </Link>

        <nav className="hidden items-center gap-9 lg:flex" aria-label="Primary navigation">
          {navItems.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                variant="plain"
                className={`luxury-link text-[0.72rem] font-bold uppercase tracking-[0.18em] transition ${
                  active
                    ? "text-[#9c3f28]!"
                    : "text-[#343129]! hover:text-[#9c3f28]!"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-4 lg:flex">
          <LinkButton
            href="/reservations"
            variant="primary"
            className="h-10! rounded-lg! bg-[#181713]! px-5! text-[0.68rem]! font-bold! uppercase! tracking-[0.18em]! text-[#fbfaf6]! hover:bg-[#9c3f28]!"
          >
            Request a stay
          </LinkButton>
        </div>

        <Button
          type="button"
          variant="outline"
          shape="circle"
          size="lg"
          aria-label={open ? "Close navigation" : "Open navigation"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
          icon={open ? <XIcon size={20} /> : <ListIcon size={21} />}
          className="h-11! w-11! rounded-full! border-black/15! text-[#181713]! lg:hidden!"
        />
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-black/10 bg-[#f3f0e9] lg:hidden"
          >
            <nav className="page-gutter grid gap-1 py-6" aria-label="Mobile navigation">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={reduceMotion ? false : { opacity: 0, x: -14 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link
                    href={item.href}
                    variant="plain"
                    onClick={() => setOpen(false)}
                    className="font-display block! border-b border-black/10 py-4 text-4xl font-medium text-[#181713]!"
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <LinkButton
                href="/reservations"
                variant="primary"
                onClick={() => setOpen(false)}
                className="mt-5 h-12! rounded-lg! bg-[#181713]! text-xs! font-bold! uppercase! tracking-[0.18em]! text-white!"
              >
                Request a stay
              </LinkButton>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
