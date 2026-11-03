import { Reveal } from "@/components/effects/reveal";
import { coverage } from "@/data/projects";
import { cn } from "@/lib/utils";

export function Coverage() {
  return (
    <Reveal>
      <div className="mb-6 max-w-2xl">
        <h4 className="text-lg font-semibold tracking-tight text-foreground">What the rules catch</h4>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted md:text-base">
          Ten rules in v0.1.1. ERROR rules flag code that is unsafe as written. WARNING rules flag code a
          reviewer should check in context.
        </p>
      </div>

      {/* Phones: one block per rule. md and up: a table. */}
      <ul className="divide-y divide-line border-y border-line md:hidden">
        {coverage.map((row) => (
          <li key={row.rule} className="py-4">
            <div className="flex items-baseline justify-between gap-4">
              <p className="text-sm text-foreground">{row.detects}</p>
              <span
                className={cn(
                  "shrink-0 font-mono text-xs",
                  row.severity === "ERROR" ? "text-error" : "text-warn",
                )}
              >
                {row.severity}
              </span>
            </div>
            <p className="mt-1.5 break-all font-mono text-xs text-muted">{row.rule}</p>
            <p className="mt-1 font-mono text-xs text-subtle">
              {row.cwe} · OWASP {row.owasp}
            </p>
          </li>
        ))}
      </ul>

      <div className="hidden overflow-x-auto rounded-lg border border-line-strong bg-background md:block">
        <table className="w-full text-left text-sm">
          <caption className="sr-only">Rules in Sentinel-Security v0.1.1</caption>
          <thead className="bg-raised font-mono text-xs text-subtle">
            <tr>
              <th scope="col" className="px-4 py-3 font-normal">Detects</th>
              <th scope="col" className="px-4 py-3 font-normal">Rule</th>
              <th scope="col" className="px-4 py-3 font-normal">CWE</th>
              <th scope="col" className="px-4 py-3 font-normal">OWASP</th>
              <th scope="col" className="px-4 py-3 font-normal">Severity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {coverage.map((row) => (
              <tr key={row.rule}>
                <th scope="row" className="px-4 py-3 font-normal text-foreground">{row.detects}</th>
                <td className="px-4 py-3 font-mono text-xs text-muted">{row.rule}</td>
                <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted">{row.cwe}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted">{row.owasp}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "font-mono text-xs",
                      row.severity === "ERROR" ? "text-error" : "text-warn",
                    )}
                  >
                    {row.severity}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Reveal>
  );
}
