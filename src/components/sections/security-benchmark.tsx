import { Reveal } from "@/components/effects/reveal";
import { benchmark } from "@/data/projects";

export function Benchmark() {
  return (
    <Reveal>
      <div className="mb-6 max-w-2xl">
        <h4 className="text-lg font-semibold tracking-tight text-foreground">Benchmark by release</h4>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-muted">
          The v0.1.1 gain came from a miss the benchmark found: SQL appended inside an if.
        </p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-line-strong bg-background">
        <table className="w-full text-left text-xs sm:text-sm">
          <caption className="sr-only">Benchmark results by release</caption>
          <thead className="bg-raised font-mono text-xs text-subtle">
            <tr>
              <th scope="col" className="px-2 py-3 sm:px-4 font-normal">Release</th>
              <th scope="col" className="px-2 py-3 sm:px-4 text-right font-normal">Findings</th>
              <th scope="col" className="px-2 py-3 sm:px-4 text-right font-normal"><abbr title="True positives" className="no-underline">TP</abbr></th>
              <th scope="col" className="px-2 py-3 sm:px-4 text-right font-normal"><abbr title="False positives" className="no-underline">FP</abbr></th>
              <th scope="col" className="px-2 py-3 sm:px-4 text-right font-normal">Precision</th>
              <th scope="col" className="px-2 py-3 sm:px-4 text-right font-normal">Recall</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line font-mono tabular-nums">
            {benchmark.map((row, index) => {
              const latest = index === benchmark.length - 1;
              return (
                <tr key={row.release} className={latest ? "text-foreground" : "text-muted"}>
                  <th scope="row" className="px-2 py-3 sm:px-4 font-normal">
                    {row.release}
                    {latest ? <span className="ml-2 hidden text-xs text-accent sm:inline">latest</span> : null}
                  </th>
                  <td className="px-2 py-3 sm:px-4 text-right">{row.findings}</td>
                  <td className="px-2 py-3 sm:px-4 text-right">{row.truePositives}</td>
                  <td className="px-2 py-3 sm:px-4 text-right">{row.falsePositives}</td>
                  <td className="px-2 py-3 sm:px-4 text-right">{row.precision}</td>
                  <td className="px-2 py-3 sm:px-4 text-right">{row.recall}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p className="mt-3 text-xs leading-relaxed text-subtle">
        Recall is over the 23 planted cases in categories the rules cover. Three planted cases (SSRF, open
        redirect, mass assignment) have no rule yet; counting them, recall is 58%. Method and per-case
        results are in docs/benchmark-results.md.
      </p>
    </Reveal>
  );
}
