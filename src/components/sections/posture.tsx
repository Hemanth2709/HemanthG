import { RelativeTime } from "@/components/threatscape/relative-time";
import { SectionHeading } from "@/components/ui/section-heading";
import type { CheckStatus } from "@/lib/posture/evaluate";
import { fetchPosture } from "@/lib/posture/fetch";
import { cn } from "@/lib/utils";

const STATUS: Record<CheckStatus, { label: string; tone: string }> = {
  pass: { label: "Present", tone: "text-defence border-defence/40" },
  partial: { label: "Partial", tone: "text-warn border-warn/40" },
  missing: { label: "Missing", tone: "text-threat border-threat/40" },
  unknown: { label: "Unknown", tone: "text-muted border-line-strong" },
};

/** Security headers of this site, read from its real deployed response. */
export async function Posture() {
  const report = await fetchPosture();
  return (
    <section id="posture" className="scroll-mt-20 border-t border-line py-24 md:py-36" aria-label="This site's security headers">
      <div className="container-site">
        <SectionHeading
          index="05"
          label="This site"
          title={["Practising it here.", "This site's own security headers."]}
          description="Read from the live site's real HTTP response on the server, not typed in. It covers what any visitor can observe about this website's configuration. It says nothing about your device, and it is not a full assessment of the hosting environment."
        />
        <ul className="divide-y divide-line border-y border-line">
          {report.checks.map((check) => (
            <li key={check.id} className="grid gap-2 py-5 md:grid-cols-12 md:gap-6">
              <div className="flex items-center gap-3 md:col-span-4">
                <span className={cn("rounded border px-2 py-0.5 font-mono text-[10.5px] uppercase tracking-wider", STATUS[check.status].tone)}>
                  {STATUS[check.status].label}
                </span>
                <span className="font-medium text-foreground">{check.label}</span>
              </div>
              <div className="md:col-span-8">
                <p className="text-sm leading-relaxed text-muted">{check.detail}</p>
                {check.observed ? (
                  <code className="mt-1.5 block font-mono text-[11.5px] break-all text-subtle">{check.observed}</code>
                ) : null}
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[11px] leading-relaxed text-subtle">
          {report.ok ? "Checked " : "Attempted "}
          <code>{report.url}</code> · <RelativeTime iso={report.checkedAt} /> · refreshed every 6 hours.
        </p>
      </div>
    </section>
  );
}
