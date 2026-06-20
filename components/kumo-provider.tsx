"use client";

import { forwardRef, type ReactNode } from "react";
import NextLink from "next/link";
import {
  LinkProvider,
  type LinkComponentProps,
} from "@cloudflare/kumo";

const AppLink = forwardRef<HTMLAnchorElement, LinkComponentProps>(
  function AppLink({ href, to, ...props }, ref) {
    return <NextLink ref={ref} href={href ?? to ?? "/"} {...props} />;
  },
);

export function KumoProvider({ children }: { children: ReactNode }) {
  return <LinkProvider component={AppLink}>{children}</LinkProvider>;
}
