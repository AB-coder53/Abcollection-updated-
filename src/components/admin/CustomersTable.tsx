"use client";

import type { CustomerLead } from "@/lib/leads";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function ProductCell({ lead }: { lead: CustomerLead }) {
  const product = lead.productDetails;
  if (!product) {
    return (
      <span className="text-muted-foreground">
        {lead.products.length > 0 ? lead.products.join(", ") : "General Interest"}
      </span>
    );
  }

  return (
    <div className="flex min-w-[220px] items-center gap-3">
      <img
        src={product.image}
        alt={product.name}
        className="size-14 shrink-0 rounded-xl border border-border object-cover object-top"
      />
      <div className="min-w-0">
        <p className="font-medium leading-snug">{product.name}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{product.fabric}</p>
        <p className="mt-1 text-sm font-semibold text-teal">{product.price}</p>
        <p className="mt-0.5 text-[0.65rem] text-muted-foreground">ID: {product.id}</p>
      </div>
    </div>
  );
}

export function CustomersTable({ customers }: { customers: CustomerLead[] }) {
  if (customers.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white px-6 py-12 text-center">
        <p className="font-medium">No reserve interest submissions yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          When customers reserve a product, their details will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Contact</th>
              <th className="px-4 py-3 font-semibold">Reserved Product</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer) => (
              <tr key={customer.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium">{customer.fullName}</td>
                <td className="px-4 py-3">
                  {customer.email ? (
                    <a href={`mailto:${customer.email}`} className="text-teal hover:underline">
                      {customer.email}
                    </a>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <a href={`tel:+91${customer.mobile}`} className="hover:text-teal">
                    +91 {customer.mobile}
                  </a>
                </td>
                <td className="px-4 py-3">
                  <ProductCell lead={customer} />
                </td>
                <td className="px-4 py-3 text-muted-foreground">{formatDate(customer.createdAt)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
