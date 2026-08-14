"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Loader2 } from "lucide-react";

import { DangerButton } from "@/components/admin/AdminFields";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { EarlyAccessSubscriber } from "@/lib/early-access-service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function EarlyAccessTable({ subscribers }: { subscribers: EarlyAccessSubscriber[] }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<EarlyAccessSubscriber | null>(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const openCreate = () => {
    setEditing(null);
    setEmail("");
    setError("");
    setDialogOpen(true);
  };

  const openEdit = (subscriber: EarlyAccessSubscriber) => {
    setEditing(subscriber);
    setEmail(subscriber.email);
    setError("");
    setDialogOpen(true);
  };

  async function handleSave(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        editing ? `/api/admin/early-access/${editing.id}` : "/api/admin/early-access",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email.trim() }),
        },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Save failed");
      setDialogOpen(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="mb-4 flex justify-end">
        <Button onClick={openCreate} className="rounded-full bg-teal text-teal-foreground">
          Add email
        </Button>
      </div>

      {subscribers.length === 0 ? (
        <div className="rounded-3xl border border-border bg-white px-6 py-12 text-center">
          <p className="font-medium">No early access emails yet</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Emails from the homepage early access form will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-3xl border border-border bg-white">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead className="border-b border-border bg-muted/50">
                <tr>
                  <th className="px-4 py-3 font-semibold">Email</th>
                  <th className="px-4 py-3 font-semibold">Signed up</th>
                  <th className="px-4 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subscribers.map((subscriber) => (
                  <tr key={subscriber.id} className="border-b border-border last:border-0">
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${subscriber.email}`}
                        className="font-medium text-teal hover:underline"
                      >
                        {subscriber.email}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {formatDate(subscriber.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-full"
                          onClick={() => openEdit(subscriber)}
                        >
                          Edit
                        </Button>
                        <DangerButton
                          label="Delete"
                          onConfirm={async () => {
                            const res = await fetch(`/api/admin/early-access/${subscriber.id}`, {
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="rounded-2xl sm:max-w-md">
          <DialogTitle>{editing ? "Edit email" : "Add early access email"}</DialogTitle>
          <DialogDescription>
            {editing ? "Update this subscriber email." : "Manually add an early access subscriber."}
          </DialogDescription>
          <form onSubmit={handleSave} className="mt-4 space-y-4">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              className="h-11 rounded-xl"
              required
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                className="flex-1 rounded-full"
                onClick={() => setDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-full bg-teal text-teal-foreground"
              >
                {loading ? <Loader2 className="size-4 animate-spin" /> : "Save"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
