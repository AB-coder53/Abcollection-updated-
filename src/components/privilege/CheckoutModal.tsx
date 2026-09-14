"use client";

import { ArrowRight, Check, ShieldCheck, Tag, X } from "lucide-react";
import { useState } from "react";

import { DISCOUNT_AMOUNT, ISTEFADA_SOURCE, PROMO_CODE } from "@/lib/privilege/content";
import type { PrivilegeProduct } from "@/lib/privilege/types";

type CheckoutModalProps = {
  product: PrivilegeProduct | null;
  selectedSize: string;
  selectedColor: string;
  isOpen: boolean;
  onClose: () => void;
};

function normalizeMobile(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 10 ? digits.slice(-10) : digits;
}

export function CheckoutModal({
  product,
  selectedSize,
  selectedColor,
  isOpen,
  onClose,
}: CheckoutModalProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Surat");
  const [address, setAddress] = useState("");
  const [isPlaced, setIsPlaced] = useState(false);
  const [orderCode, setOrderCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !product) return null;

  const originalTotal = product.originalPrice;
  const grantDiscount = DISCOUNT_AMOUNT;
  const finalPrice = product.price;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const mobile = normalizeMobile(phone);
    if (!/^[6-9]\d{9}$/.test(mobile)) {
      setError("Enter a valid 10-digit Indian mobile number.");
      setSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: name.trim(),
          email: email.trim(),
          mobile,
          city: city.trim(),
          deliveryNotes: address.trim(),
          promoCode: PROMO_CODE,
          source: ISTEFADA_SOURCE,
          product: {
            id: product.catalogId,
            name: product.name,
            price: `₹${product.price.toLocaleString("en-IN")}`,
            originalPrice: `₹${product.originalPrice.toLocaleString("en-IN")}`,
            fabric: product.gsm,
            image: product.image,
            color: selectedColor || product.variant,
            size: selectedSize,
            promoCode: PROMO_CODE,
          },
        }),
      });

      const data = (await response.json()) as { error?: string; orderCode?: string };

      if (!response.ok) {
        setError(data.error ?? "We couldn't save your order. Please try again.");
        return;
      }

      setOrderCode(data.orderCode ?? null);
      setIsPlaced(true);
    } catch {
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleReset = () => {
    setIsPlaced(false);
    setOrderCode(null);
    setError(null);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-[#111111]/70 backdrop-blur-sm p-0 sm:p-4 transition-all"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="bg-[#fcf9f3] w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col border border-[#111111]">
        <div className="p-4 sm:p-5 border-b border-[#c4c7c7]/30 flex items-center justify-between bg-[#f0eee8]">
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#7C5E1D] uppercase tracking-[0.16em]">
              PRIVILEGE REDEMPTION
            </span>
            <h3 id="modal-title" className="privilege-serif text-[20px] text-[#111111]">
              {isPlaced ? "Order Confirmed" : "Bespoke Checkout"}
            </h3>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="p-2 text-[#444748] hover:text-[#111111] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPlaced ? (
          <div className="p-6 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-[#111111] text-white flex items-center justify-center mb-4">
              <Check className="w-6 h-6 text-[#e3c27e]" />
            </div>

            <span className="text-[10px] font-bold text-[#7C5E1D] uppercase tracking-[0.16em] mb-1">
              {orderCode ? `ORDER CODE: ${orderCode}` : "SURAT DROP ALLOCATION #0942"}
            </span>
            <h4 className="privilege-serif text-[26px] text-[#111111] mb-2">Commission Reserved</h4>
            <p className="text-[14px] text-[#444748] max-w-sm mb-6 leading-relaxed">
              Thank you {name || "friend"}! Your order for{" "}
              <strong className="text-[#111111]">
                {product.name} ({product.variant})
              </strong>{" "}
              in Size <strong className="text-[#111111]">{selectedSize}</strong> has been allocated
              with {PROMO_CODE} (₹{grantDiscount} off) applied.
            </p>

            <div className="bg-[#f0eee8] w-full p-4 text-left mb-6 text-[13px] border border-[#c4c7c7]/40 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-[#444748]">Promo code:</span>
                <span className="font-semibold text-[#7C5E1D]">{PROMO_CODE}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#444748]">Dispatch Origin:</span>
                <span className="font-semibold text-[#111111]">AB Collection Atelier, Ujjain</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#444748]">Destination:</span>
                <span className="font-semibold text-[#111111]">{city || "Surat"}</span>
              </div>
              {address && (
                <div className="flex justify-between gap-4">
                  <span className="text-[#444748] shrink-0">Address:</span>
                  <span className="font-semibold text-[#111111] text-right">{address}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-[#444748]">Total Payable on Delivery:</span>
                <span className="font-bold text-[#111111]">₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleReset}
              className="w-full py-3.5 bg-[#111111] text-white text-[12px] font-semibold uppercase tracking-[0.14em] hover:bg-[#2B2B2B] transition-colors cursor-pointer"
            >
              RETURN TO COLLECTION
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmitOrder} className="p-5 sm:p-6 flex flex-col gap-5">
            <div className="flex gap-4 p-3.5 bg-[#f6f3ed] border border-[#c4c7c7]/40">
              <div className="w-20 h-24 bg-[#ebe8e2] flex-shrink-0 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex flex-col justify-between flex-grow">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] uppercase tracking-[0.16em] text-[#7C5E1D] font-bold">
                      {product.tag}
                    </span>
                    <span className="text-[11px] font-bold text-[#111111] px-1.5 py-0.5 bg-white border border-[#c4c7c7]/50">
                      SIZE: {selectedSize}
                    </span>
                  </div>
                  <h4 className="privilege-serif text-[16px] font-medium text-[#111111] leading-tight mt-0.5">
                    {product.name}
                  </h4>
                  <p className="text-[12px] text-[#444748]">{product.variant}</p>
                </div>

                <div className="flex items-baseline gap-2">
                  <span className="privilege-serif text-[16px] font-semibold text-[#111111]">
                    ₹{finalPrice.toLocaleString()}
                  </span>
                  <span className="text-[12px] text-[#747878] line-through">
                    ₹{originalTotal.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-[#111111] text-white">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-[#e3c27e]" />
                <span className="text-[11px] uppercase tracking-wider font-semibold">
                  GRANT: {PROMO_CODE}
                </span>
              </div>
              <span className="text-[12px] font-bold text-[#e3c27e]">
                -₹{grantDiscount} APPLIED
              </span>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label
                  htmlFor="customer-name"
                  className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider block mb-1"
                >
                  Full Name
                </label>
                <input
                  id="customer-name"
                  type="text"
                  required
                  placeholder="e.g. Abbas Vasi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-[14px] bg-[#fcf9f3] border border-[#c4c7c7] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label
                  htmlFor="customer-email"
                  className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider block mb-1"
                >
                  Email
                </label>
                <input
                  id="customer-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-[14px] bg-[#fcf9f3] border border-[#c4c7c7] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label
                    htmlFor="customer-phone"
                    className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider block mb-1"
                  >
                    WhatsApp / Phone
                  </label>
                  <input
                    id="customer-phone"
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-[14px] bg-[#fcf9f3] border border-[#c4c7c7] focus:border-[#111111] focus:outline-none transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="customer-city"
                    className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider block mb-1"
                  >
                    City (Drop Region)
                  </label>
                  <select
                    id="customer-city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 text-[14px] bg-[#fcf9f3] border border-[#c4c7c7] focus:border-[#111111] focus:outline-none transition-colors"
                  >
                    <option value="Surat">Surat (Local Drop)</option>
                    <option value="Mumbai">Mumbai</option>
                    <option value="Ujjain">Ujjain</option>
                    <option value="Indore">Indore</option>
                    <option value="Kuwait / UAE">Kuwait / UAE</option>
                    <option value="Other India City">Other India City</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="customer-address"
                  className="text-[11px] font-semibold text-[#111111] uppercase tracking-wider block mb-1"
                >
                  Delivery Address / Notes
                </label>
                <input
                  id="customer-address"
                  type="text"
                  required
                  placeholder="Apartment, Street, Mohalla / Locality"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-3 py-2 text-[14px] bg-[#fcf9f3] border border-[#c4c7c7] focus:border-[#111111] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[#c4c7c7]/30 text-[13px] space-y-1">
              <div className="flex justify-between text-[#444748]">
                <span>Piece Subtotal</span>
                <span>₹{originalTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#7C5E1D] font-medium">
                <span>Special Privilege Grant</span>
                <span>-₹{grantDiscount}</span>
              </div>
              <div className="flex justify-between text-[#444748]">
                <span>Tactile Unboxing &amp; Express Courier</span>
                <span className="text-[#7C5E1D] font-bold uppercase text-[10px]">
                  Complimentary
                </span>
              </div>
              <div className="flex justify-between text-[#111111] font-bold pt-2 border-t border-[#c4c7c7]/40 text-[15px]">
                <span>Total Payable</span>
                <span>₹{finalPrice.toLocaleString()}</span>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                {error}
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#444748]">
              <ShieldCheck className="w-4 h-4 text-[#7C5E1D]" />
              <span>Direct Artisan Commission • 100% Cotton Quality Guarantee</span>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full min-h-[50px] py-3.5 bg-[#111111] text-white text-[12px] font-semibold tracking-[0.14em] uppercase flex items-center justify-center gap-2 hover:bg-[#2B2B2B] active:scale-[0.98] transition-all cursor-pointer shadow-md disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <span>
                {submitting ? "SUBMITTING…" : `CONFIRM ORDER • ₹${finalPrice.toLocaleString()}`}
              </span>
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
