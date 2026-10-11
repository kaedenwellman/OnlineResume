"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * The address is assembled in the browser from its parts, so the full email
 * never appears as plain text in the static HTML.
 */
export default function EmailLink({ user, domain, label }: { user: string; domain: string; label?: string }) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  const addr = hydrated ? `${user}@${domain}` : null;

  return (
    <span className="block">
      {label && <span className="block text-band-muted">{label}</span>}
      {addr ? (
        <a href={`mailto:${addr}`} className="inline-block py-2 underline underline-offset-4 hover:text-[var(--accent-blue)]">
          {addr}
        </a>
      ) : (
        <span className="inline-block py-2 text-band-muted">Email loading…</span>
      )}
    </span>
  );
}
