"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Loader2, X } from "lucide-react";

import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { colorSwatchClass, colorToImageIndex } from "@/lib/product-colors";
import type { ReservationSelection } from "@/lib/reservation-types";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selection: ReservationSelection | null;
};

const isValidEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
const isValidMobile = (value: string) => /^[6-9]\d{9}$/.test(value.trim());

const fieldClass =
  "mt-2 h-12 rounded-xl border border-border bg-muted/40 px-4 text-base shadow-none transition-colors focus-visible:border-foreground focus-visible:bg-background focus-visible:ring-0";

export function ReserveInterestDialog({ open, onOpenChange, selection }: Props) {
  const product = selection?.product ?? null;
  const images = product?.images?.length ? product.images : product ? [product.image] : [];

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [touched, setTouched] = useState({ fullName: false, email: false, mobile: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<{ orderCode: string; duplicate: boolean } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!open) return;
    setFullName("");
    setEmail("");
    setMobile("");
    setSelectedColor(selection?.color ?? product?.colors[0] ?? "");
    setSelectedSize(selection?.size ?? product?.sizes[0] ?? "");
    setTouched({ fullName: false, email: false, mobile: false });
    setError("");
    setDone(null);
    setCopied(false);
    setLoading(false);
  }, [open, selection, product]);

  const previewImage = useMemo(() => {
    if (!product) return "";
    if (selectedColor) {
      const index = colorToImageIndex(selectedColor, product.colors, images);
      return images[index] ?? product.image;
    }
    return selection?.image ?? product.image;
  }, [product, selectedColor, images, selection?.image]);

  const nameValid = fullName.trim().length >= 2;
  const emailValid = isValidEmail(email);
  const mobileValid = isValidMobile(mobile);
  const colorValid = !product || !!selectedColor;
  const sizeValid = !product || !!selectedSize;
  const canSubmit = nameValid && emailValid && mobileValid && colorValid && sizeValid && !loading;

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
                image: previewImage,
                color: selectedColor,
                size: selectedSize,
              }
            : undefined,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        orderCode?: string;
        duplicate?: boolean;
      };
      if (!response.ok || !payload.ok) {
        throw new Error(payload.error ?? "Submission failed");
      }
      if (!payload.orderCode) {
        throw new Error(
          "Reservation saved but no order code was returned. Please contact support.",
        );
      }
      setDone({ orderCode: payload.orderCode, duplicate: !!payload.duplicate });
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
              <h2 className="mt-6 font-display text-3xl leading-tight">Thank you!</h2>
            </DialogTitle>
            <DialogDescription asChild>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {done.duplicate
                  ? "You're already on our list. Here's your reservation code:"
                  : "Your interest has been reserved successfully."}
                {product ? (
                  <>
                    {" "}
                    <span className="font-medium text-foreground">{product.name}</span>
                    {selectedColor ? ` in ${selectedColor}` : ""}
                    {selectedSize ? `, size ${selectedSize}` : ""}.
                  </>
                ) : (
                  " We'll reach out before launch."
                )}
              </p>
            </DialogDescription>

            <div className="mt-6 rounded-2xl border border-border bg-muted/40 px-4 py-5">
              <p className="text-[0.65rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                Your order code
              </p>
              <p className="mt-2 font-display text-2xl font-bold tracking-wide text-teal">
                {done.orderCode}
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={async () => {
                  try {
                    await navigator.clipboard.writeText(done.orderCode);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 2000);
                  } catch {
                    setCopied(false);
                  }
                }}
                className="mt-4 h-10 rounded-full px-5 text-xs tracking-[0.12em] uppercase"
              >
                {copied ? "Copied!" : "Copy code"}
              </Button>
            </div>

            <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
              Save this code for your records. We&apos;ll contact you before launch with your
              exclusive 10% discount.
            </p>

            <Button
              onClick={() => onOpenChange(false)}
              className="mt-8 h-12 w-full rounded-full text-xs tracking-[0.18em] uppercase"
            >
              Continue Browsing
            </Button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="max-h-[70vh] overflow-y-auto px-5 py-6"
            noValidate
          >
            <DialogTitle asChild>
              <h2 className="font-display text-2xl leading-tight">Reserve your launch access</h2>
            </DialogTitle>
            <DialogDescription asChild>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {product
                  ? `Choose your colour and size for ${product.name}. No payment today.`
                  : "Share your details and we'll notify you before everyone else when we launch."}
              </p>
            </DialogDescription>

            {product ? (
              <div className="mt-5 rounded-2xl border border-border bg-muted/30 p-4">
                <div className="flex gap-4">
                  <img
                    src={previewImage}
                    alt={`${product.name} — ${selectedColor}`}
                    className="size-20 shrink-0 rounded-xl object-cover object-top"
                  />
                  <div className="min-w-0">
                    <p className="font-medium leading-snug">{product.name}</p>
                    <p className="mt-1 text-sm text-teal">{product.price}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{product.fabric}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase">Colour</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.colors.map((color) => {
                      const selected = color === selectedColor;
                      return (
                        <button
                          key={color}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedColor(color)}
                          className={cn(
                            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors",
                            selected
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-background hover:border-foreground",
                          )}
                        >
                          <span
                            aria-hidden
                            className={cn("size-3 rounded-full", colorSwatchClass(color))}
                          />
                          {color}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs font-semibold tracking-[0.12em] uppercase">Size</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const selected = size === selectedSize;
                      return (
                        <button
                          key={size}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedSize(size)}
                          className={cn(
                            "inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-xs transition-colors",
                            selected
                              ? "border-foreground bg-foreground text-background"
                              : "border-border bg-background hover:border-foreground",
                          )}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ) : null}

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
