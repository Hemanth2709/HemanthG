"use client";

import { Check, Copy } from "lucide-react";
import * as React from "react";

/** Email as a mailto link, with a button that copies the address. */
export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
    } catch {
      // Clipboard unavailable (insecure context or denied): the mailto link still works.
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${email}`}
        className="text-[1.65rem] font-semibold tracking-[-0.02em] break-all text-foreground underline decoration-line-strong decoration-1 underline-offset-[0.2em] transition-colors duration-200 hover:text-accent-bright hover:decoration-accent sm:text-4xl md:text-5xl"
      >
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="inline-flex h-9 items-center gap-1.5 rounded-full border border-line-strong px-3.5 text-xs text-muted transition-colors duration-200 hover:border-accent/60 hover:text-foreground"
      >
        {copied ? <Check className="size-3.5 text-success" /> : <Copy className="size-3.5" />}
        <span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
      </button>
    </div>
  );
}
