"use client";

import type { EarlyAccessSubscriber } from "@/lib/early-access-service";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function EarlyAccessTable({ subscribers }: { subscribers: EarlyAccessSubscriber[] }) {
  if (subscribers.length === 0) {
    return (
      <div className="rounded-3xl border border-border bg-white px-6 py-12 text-center">
        <p className="font-medium">No early access emails yet</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Emails from the homepage early access form will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-border bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead className="border-b border-border bg-muted/50">
            <tr>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Signed up</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
