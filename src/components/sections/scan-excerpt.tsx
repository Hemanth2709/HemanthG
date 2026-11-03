import { cn } from "@/lib/utils";

/**
 * Lines copied from a real run of Sentinel-Security v0.1.1 against the
 * repository's examples/vulnerable directory. Rule messages are omitted
 * for space and the "rules." config-path prefix is dropped from rule IDs;
 * file paths, line numbers and code are verbatim.
 */
const findings = [
  {
    file: "examples/vulnerable/cors-misconfiguration.ts",
    severity: "ERROR",
    rule: "sentinel-cors-credentials-any-origin",
    line: 12,
    code: "app.enableCors({ origin: true, credentials: true });",
  },
  {
    file: "examples/vulnerable/insecure-cookies.ts",
    severity: "WARNING",
    rule: "sentinel-insecure-session-cookie",
    line: 15,
    code: "res.cookie('session_token', sessionToken);",
  },
  {
    file: "examples/vulnerable/jwt-misconfiguration.ts",
    severity: "ERROR",
    rule: "sentinel-jwt-ignore-expiration",
    line: 14,
    code: "ignoreExpiration: true,",
  },
  {
    file: "examples/vulnerable/next-public-secrets.ts",
    severity: "ERROR",
    rule: "sentinel-next-public-secret-env",
    line: 8,
    code: "export const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY as string);",
  },
] as const;

export function ScanExcerpt() {
  return (
    <figure className="overflow-hidden rounded-lg border border-line-strong bg-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.8)]">
      <div className="flex items-center justify-between gap-4 border-b border-line px-4 py-2.5">
        <span className="font-mono text-xs text-subtle">semgrep 1.180.0</span>
        <span className="font-mono text-xs text-subtle">4 of 11 findings shown</span>
      </div>

      <div className="px-4 py-5 font-mono text-[11.5px] leading-relaxed sm:px-5 sm:text-[12.5px]">
        <p className="[overflow-wrap:anywhere] text-foreground">
          <span className="select-none text-subtle">$ </span>
          semgrep scan --config rules/ examples/vulnerable
        </p>

        <div className="mt-4 flex flex-col gap-4">
          {findings.map((finding) => {
            const error = finding.severity === "ERROR";
            return (
              <div key={`${finding.file}:${finding.line}`} className="[overflow-wrap:anywhere]">
                <p className="text-muted">{finding.file}</p>
                <p className={cn("pl-2", error ? "text-danger" : "text-accent")}>
                  <span aria-hidden className="whitespace-pre">{error ? "❯❯❱" : " ❯❱"}</span>{" "}
                  <span className="sr-only">{finding.severity}: </span>
                  {finding.rule}
                </p>
                <p className="flex pl-2 text-foreground/85 sm:pl-6">
                  <span className="shrink-0 select-none whitespace-pre text-subtle">
                    {String(finding.line).padStart(3, " ")}┆{" "}
                  </span>
                  <span className="min-w-0">{finding.code}</span>
                </p>
              </div>
            );
          })}
        </div>

        <p className="mt-5 border-t border-line pt-4 text-foreground">
          Ran 10 rules on 8 files: <span className="text-accent-bright">11 findings</span>.
        </p>
      </div>

      <figcaption className="border-t border-line px-4 py-2.5 text-xs text-subtle sm:px-5">
        Excerpt from a scan of the repository&apos;s deliberately vulnerable examples.
      </figcaption>
    </figure>
  );
}
