"use client";

import { useEffect, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Product } from "@/lib/catalog-types";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const isValidMobile = (value: string) => /^[6-9]\d{9}$/.test(value.trim());

const fieldClass =
  "mt-2 h-12 rounded-xl border border-border bg-muted/40 px-4 text-base shadow-none transition-colors focus-visible:border-foreground focus-visible:bg-background focus-visible:ring-0";

export function ReserveInterestDialog({ open, onOpenChange, product }: Props) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [touched, setTouched] = useState({ fullName: false, email: false, mobile: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFullName("");
    setEmail("");
    setMobile("");
    setTouched({ fullName: false, email: false, mobile: false });
    setError("");
    setDone(false);
    setLoading(false);
  }, [open]);

  const nameValid = fullName.trim().length >= 2;
  const emailValid = isValidEmail(email);
  const mobileValid = isValidMobile(mobile);
  const canSubmit = nameValid && emailValid && mobileValid && !loading;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setTouched({ fullName: true, email: true, mobile: true });
    if (!canSubmit) return;

    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          mobile: mobile.trim(),
          product: product
            ? {
                id: product.id,
                name: product.name,
                price: product.price,
                fabric: product.fabric,
                image: product.image,
              }
            : undefined,
        }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Submission failed");
      }
      setDone(true);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "We couldn't save your details right now. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="gap-0 overflow-hidden rounded-2xl border border-border p-0 sm:max-w-md [&>button:last-child]:hidden">
        <header className="flex items-center justify-between border-b border-border bg-muted/30 px-5 py-4">
          <p className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
            Reserve Interest
          </p>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="Close"
            className="flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </header>

        {done ? (
          <div className="px-6 py-10 text-center">
            <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-olive text-olive-foreground">
              <Check className="size-6" strokeWidth={1.5} />
            </div>
            <DialogTitle asChild>
              <h2 className="mt-6 font-display text-3xl leading-tight">You're on the list.</h2>
            </DialogTitle>
            <DialogDescription asChild>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                Thanks for your interest in AB Collection
                {product ? ` — ${product.name}` : ""}. We'll reach out before launch with your
                exclusive 10% discount.
              </p>
            </DialogDescription>
            <Button
              onClick={() => onOpenChange(false)}
              className="mt-8 h-12 w-full rounded-full text-xs tracking-[0.18em] uppercase"
            >
              Continue Browsing
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-5 py-6" noValidate>
            <DialogTitle asChild>
              <h2 className="font-display text-2xl leading-tight">Reserve your launch access</h2>
            </DialogTitle>
            <DialogDescription asChild>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product
                  ? `Tell us how to reach you about ${product.name}. No payment today.`
                  : "Share your details and we'll notify you before everyone else when we launch."}
              </p>
            </DialogDescription>

            <div className="mt-6 space-y-5">
              <div>
                <Label
                  htmlFor="interest-name"
                  className="text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  Full name
                </Label>
                <Input
                  id="interest-name"
                  name="name"
                  autoComplete="name"
                  maxLength={100}
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, fullName: true }))}
                  placeholder="Your name"
                  className={cn(
                    fieldClass,
                    touched.fullName && !nameValid ? "border-destructive" : "",
                  )}
                />
                {touched.fullName && !nameValid ? (
                  <p className="mt-1.5 text-xs text-destructive">Please enter your full name.</p>
                ) : null}
              </div>

              <div>
                <Label
                  htmlFor="interest-email"
                  className="text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  Email address
                </Label>
                <Input
                  id="interest-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={255}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                  placeholder="you@email.com"
                  className={cn(
                    fieldClass,
                    touched.email && !emailValid ? "border-destructive" : "",
                  )}
                />
                {touched.email && !emailValid ? (
                  <p className="mt-1.5 text-xs text-destructive">Enter a valid email address.</p>
                ) : null}
              </div>

              <div>
                <Label
                  htmlFor="interest-mobile"
                  className="text-xs font-semibold tracking-[0.12em] uppercase"
                >
                  Contact number
                </Label>
                <Input
                  id="interest-mobile"
                  name="tel"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel-national"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  onBlur={() => setTouched((t) => ({ ...t, mobile: true }))}
                  placeholder="10-digit mobile number"
                  className={cn(
                    fieldClass,
                    touched.mobile && !mobileValid ? "border-destructive" : "",
                  )}
                />
                {touched.mobile && !mobileValid ? (
                  <p className="mt-1.5 text-xs text-destructive">
                    Enter a valid 10-digit Indian mobile number.
                  </p>
                ) : null}
              </div>
            </div>

            {error ? (
              <p className="mt-4 rounded-xl border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                {error}
              </p>
            ) : null}

            <div className="mt-6 border-t border-border pt-5">
              <Button
                type="submit"
                disabled={!canSubmit}
                className="h-12 w-full rounded-full bg-teal text-xs tracking-[0.18em] uppercase hover:bg-teal/90"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Submitting…
                  </>
                ) : (
                  "Reserve Interest"
                )}
              </Button>
              <p className="mt-3 text-center text-[0.65rem] tracking-[0.12em] text-muted-foreground uppercase">
                No payment today · 10% launch discount reserved
              </p>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
