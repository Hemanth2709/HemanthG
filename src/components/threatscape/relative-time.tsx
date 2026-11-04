"use client";

import { useEffect, useState } from "react";

/**
 * "3 hours ago", computed in the visitor's browser from a timestamp in the
 * page. Flags data older than a day as possibly stale. Reads only the clock.
 */
export function RelativeTime({ iso }: { iso: string }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => setNow(Date.now()), []);
  const time = new Date(iso);
  const exact = `${time.toISOString().slice(0, 16).replace("T", " ")} UTC`;
  if (now === null) return <time dateTime={iso}>{exact}</time>;
  const hours = Math.max(0, Math.round((now - time.getTime()) / 36e5));
  const label = hours < 1 ? "less than an hour ago" : hours < 48 ? `${hours} hour${hours === 1 ? "" : "s"} ago` : `${Math.round(hours / 24)} days ago`;
  return (
    <time dateTime={iso} title={exact}>
      {label}
      {hours > 24 ? <span className="text-warn"> · may be stale</span> : null}
    </time>
  );
}
