"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { CustomerFormDialog } from "@/components/admin/CustomerFormDialog";
import { DangerButton } from "@/components/admin/AdminFields";
import { Button } from "@/components/ui/button";
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
        {lead.preferredColor ? (
          <p className="mt-1 text-xs">
            Colour: <span className="font-medium">{lead.preferredColor}</span>
          </p>
        ) : null}
        {lead.preferredSize ? (
          <p className="mt-0.5 text-xs">
            Size: <span className="font-medium">{lead.preferredSize}</span>
          </p>
        ) : null}
        <p className="mt-1 text-sm font-semibold text-teal">{product.price}</p>
      </div>
    </div>
  );
}

export function CustomersTable({ customers }: { customers: CustomerLead[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<CustomerLead | null>(null);

  const openCreate = () => {
    setEditing(null);
    setDialogOpen(true);
  };

  const openEdit = (customer: CustomerLead) => {
    setEditing(customer);
    setDialogOpen(true);
  };

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} className="rounded-full bg-teal text-teal-foreground">
          Add customer
        </Button>
      </div>

      {customers.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white px-6 py-12 text-center">
          <p className="font-medium">No reserve interest submissions yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            When customers reserve a product, their details will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Customer</th>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Contact</th>
                  <th className="px-4 py-3 font-semibold">Reserved Product</th>
                  <th className="px-4 py-3 font-semibold">Order code</th>
                  <th className="px-4 py-3 font-semibold">Submitted</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
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
                    <td className="px-4 py-3 font-mono text-xs font-semibold text-teal">
                      {customer.orderCode ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(customer.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => openEdit(customer)}
                        >
                          Edit
                        </Button>
                        <DangerButton
                          label="Delete"
                          onConfirm={async () => {
                            const res = await fetch(`/api/admin/customers/${customer.id}`, {
                              method: "DELETE",
                            });
                            if (!res.ok) {
                              const data = (await res.json()) as { error?: string };
                              window.alert(data.error ?? "Delete failed");
                              return;
                            }
                            router.refresh();
                          }}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CustomerFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        customer={editing}
        onSaved={() => router.refresh()}
      />
    </>
  );
}
