"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Search, User, X } from "lucide-react";
import { useState } from "react";

import { useReservation } from "@/components/site/SiteShell";
import { Button } from "@/components/ui/button";
import { NAV_LINKS } from "@/lib/site";
import { cn } from "@/lib/utils";

export function SiteHeader() {
  const pathname = usePathname();
  const { ctaLabel, primaryCta } = useReservation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid h-16 max-w-7xl grid-cols-[1fr_auto] items-center gap-3 px-5 sm:h-20 sm:gap-4 sm:px-8 md:grid-cols-[1fr_auto_1fr]">
        <Link
          href="/"
          className="truncate font-display text-xl font-bold tracking-tight sm:text-[1.7rem]"
          aria-label="AB Collection home"
        >
          AB Collection
        </Link>

        <nav
          className="hidden items-center rounded-full bg-muted px-2 py-1.5 md:flex"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-background text-foreground shadow-sm"
                    : "text-foreground/75 hover:bg-background hover:text-foreground",
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center justify-end gap-1.5 sm:gap-3">
          <Link
            href="/collection"
            aria-label="Browse collection"
            className="hidden size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
          >
            <Search className="size-4" strokeWidth={1.75} />
          </Link>
          <button
            type="button"
            aria-label="Account"
            onClick={primaryCta}
            className="hidden size-10 items-center justify-center rounded-full text-foreground/70 transition-colors hover:bg-muted hover:text-foreground md:inline-flex"
          >
            <User className="size-4" strokeWidth={1.75} />
          </button>
          <Button
            onClick={primaryCta}
            className="hidden h-10 rounded-full bg-teal px-5 text-xs font-semibold tracking-[0.08em] text-teal-foreground uppercase hover:bg-teal/90 md:inline-flex"
          >
            {ctaLabel}
          </Button>
          <button
            type="button"
            className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted md:hidden"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-border bg-background px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => {
              const active =
                link.href === "/"
                  ? pathname === "/"
                  : pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-full px-4 py-3 text-sm font-medium transition-colors",
                    active
                      ? "bg-muted text-foreground shadow-sm"
                      : "text-foreground/80 hover:bg-muted hover:text-foreground",
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
            <Link
              href="/collection"
              onClick={() => setMobileOpen(false)}
              className="mt-1 inline-flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium text-foreground/80 hover:bg-muted hover:text-foreground"
            >
              <Search className="size-4" strokeWidth={1.75} />
              Search collection
            </Link>
            <Button
              onClick={() => {
                setMobileOpen(false);
                primaryCta();
              }}
              className="mt-2 h-11 rounded-full bg-teal text-xs font-semibold tracking-[0.1em] text-teal-foreground uppercase"
            >
              {ctaLabel}
            </Button>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
