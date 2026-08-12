"use client";

import Link from "next/link";
import { Instagram, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

import { useReservation } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trackEvent } from "@/lib/early-access";
import { NAV_LINKS, SITE_EMAIL, SITE_INSTAGRAM } from "@/lib/site";

export function SiteFooter() {
  const { openEarlyAccess } = useReservation();
  const [email, setEmail] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    trackEvent("footer_subscribe_clicked", { email });
    openEarlyAccess();
  };

  return (
    <footer className="border-t border-border bg-sand px-5 py-16 sm:px-8 sm:py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="font-display text-4xl font-bold tracking-tight sm:text-5xl">AB Collection</p>
        <p className="mx-auto mt-4 max-w-md text-sm text-muted-foreground">
          Premium everyday essentials. Launching soon — reserve your 10% early.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mx-auto mt-8 flex max-w-lg flex-col gap-3 sm:flex-row"
        >
          <label htmlFor="footer-email" className="sr-only">
            Email address
          </label>
          <Input
            id="footer-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="h-12 flex-1 rounded-full border-border bg-background px-5"
          />
          <Button
            type="submit"
            className="h-12 rounded-full bg-teal px-8 text-xs font-semibold tracking-[0.12em] text-teal-foreground uppercase hover:bg-teal/90"
          >
            Subscribe
          </Button>
        </form>

        <nav
          className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground"
          aria-label="Footer"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={`mailto:${SITE_EMAIL}`}
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Mail className="size-3.5" /> Email
          </a>
          <a
            href={SITE_INSTAGRAM}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
          >
            <Instagram className="size-3.5" /> Instagram
          </a>
        </nav>

        <p className="mt-10 text-xs tracking-[0.12em] text-muted-foreground uppercase">
          © {new Date().getFullYear()} AB Collection · Made in India
        </p>
      </div>
    </footer>
  );
}
