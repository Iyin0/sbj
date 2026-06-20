import type { Metadata } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";
import { AvailabilityProvider } from "@/components/availability-provider";
import { KumoProvider } from "@/components/kumo-provider";
import { PricingProvider } from "@/components/pricing-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: {
    default: "Stay By Jordan | Private Apartment Stays",
    template: "%s | Stay By Jordan",
  },
  description:
    "Private two and three-bedroom apartment stays with visual walkthroughs, considered service, and personally confirmed reservations.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${body.variable} h-full scroll-smooth`}
    >
      <body className="flex min-h-full flex-col antialiased">
        <KumoProvider>
          <AvailabilityProvider>
            <PricingProvider>
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </PricingProvider>
          </AvailabilityProvider>
        </KumoProvider>
      </body>
    </html>
  );
}
