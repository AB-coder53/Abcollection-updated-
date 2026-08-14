"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { CustomerLead } from "@/lib/leads";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  customer: CustomerLead | null;
  onSaved: () => void;
};

const fieldClass = "mt-2 h-11 rounded-xl";

export function CustomerFormDialog({ open, onOpenChange, customer, onSaved }: Props) {
  const isEdit = !!customer;
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [preferredColor, setPreferredColor] = useState("");
  const [preferredSize, setPreferredSize] = useState("");
  const [productId, setProductId] = useState("");
  const [productName, setProductName] = useState("");
  const [productFabric, setProductFabric] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;
    setFullName(customer?.fullName ?? "");
    setEmail(customer?.email ?? "");
    setMobile(customer?.mobile ?? "");
    setOrderCode(customer?.orderCode ?? "");
    setPreferredColor(customer?.preferredColor ?? "");
    setPreferredSize(customer?.preferredSize ?? "");
    setProductId(customer?.productDetails?.id ?? "");
    setProductName(customer?.productDetails?.name ?? "");
    setProductFabric(customer?.productDetails?.fabric ?? "");
    setProductPrice(customer?.productDetails?.price ?? "");
    setProductImage(customer?.productDetails?.image ?? "");
    setError("");
    setLoading(false);
  }, [open, customer]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    const hasProduct = productName.trim().length > 0;
    const product = hasProduct
      ? {
          id: productId.trim() || "manual-entry",
          name: productName.trim(),
          fabric: productFabric.trim() || "Premium Cotton",
          price: productPrice.trim() || "—",
          image: productImage.trim() || "/images/hero-beige.png",
          color: preferredColor.trim() || undefined,
          size: preferredSize.trim() || undefined,
        }
      : null;

    const payload = {
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      preferredColor: preferredColor.trim() || null,
      preferredSize: preferredSize.trim() || null,
      orderCode: orderCode.trim() || null,
      product,
    };

    try {
      const res = await fetch(
        isEdit ? `/api/admin/customers/${customer.id}` : "/api/admin/customers",
        {
          method: isEdit ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      onSaved();
      onOpenChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto rounded-2xl sm:max-w-lg">
        <DialogTitle>{isEdit ? "Edit customer" : "Add customer"}</DialogTitle>
        <DialogDescription>
          {isEdit
            ? "Update reservation details for this customer."
            : "Manually add a reserve interest customer."}
        </DialogDescription>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div>
            <Label htmlFor="cust-name">Full name</Label>
            <Input
              id="cust-name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <Label htmlFor="cust-email">Email</Label>
            <Input
              id="cust-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <Label htmlFor="cust-mobile">Mobile</Label>
            <Input
              id="cust-mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value.replace(/\D/g, "").slice(0, 10))}
              className={fieldClass}
              required
            />
          </div>
          <div>
            <Label htmlFor="cust-code">Order code</Label>
            <Input
              id="cust-code"
              value={orderCode}
              onChange={(e) => setOrderCode(e.target.value.toUpperCase())}
              placeholder="Auto-generated if empty"
              className={fieldClass}
            />
          </div>

          <div className="rounded-xl border border-border p-4">
            <p className="text-sm font-semibold">Product (optional)</p>
            <div className="mt-3 space-y-3">
              <Input
                value={productName}
                onChange={(e) => setProductName(e.target.value)}
                placeholder="Product name"
                className="h-10 rounded-xl"
              />
              <Input
                value={productFabric}
                onChange={(e) => setProductFabric(e.target.value)}
                placeholder="Fabric"
                className="h-10 rounded-xl"
              />
              <Input
                value={productPrice}
                onChange={(e) => setProductPrice(e.target.value)}
                placeholder="Price"
                className="h-10 rounded-xl"
              />
              <Input
                value={productImage}
                onChange={(e) => setProductImage(e.target.value)}
                placeholder="Image URL"
                className="h-10 rounded-xl"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  value={preferredColor}
                  onChange={(e) => setPreferredColor(e.target.value)}
                  placeholder="Colour"
                  className="h-10 rounded-xl"
                />
                <Input
                  value={preferredSize}
                  onChange={(e) => setPreferredSize(e.target.value)}
                  placeholder="Size"
                  className="h-10 rounded-xl"
                />
              </div>
            </div>
          </div>

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1 rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-full bg-teal text-teal-foreground"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : isEdit ? (
                "Save changes"
              ) : (
                "Add customer"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
