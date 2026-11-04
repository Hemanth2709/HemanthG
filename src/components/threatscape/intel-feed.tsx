import { ArrowUpRight } from "lucide-react";

import { fetchGhsa, fetchKev, fetchNvd } from "@/lib/intel/fetchers";
import type { IntelResult } from "@/lib/intel/types";

import { RelativeTime } from "./relative-time";

const day = (iso?: string) => (iso ? iso.slice(0, 10) : undefined);

function Column({ result }: { result: IntelResult }) {
  const { source } = result;
  return (
    <div className="flex min-w-0 flex-col border-line max-lg:border-b max-lg:pb-8 lg:border-r lg:pr-6 lg:last:border-r-0">
      <h4 className="text-sm font-medium text-foreground">
        <a href={source.homepage} target="_blank" rel="noopener noreferrer" className="hover:text-accent-bright">
          {source.name}
        </a>
      </h4>
      <p className="mt-1 text-xs leading-relaxed text-subtle">{source.description}</p>

      {result.ok ? (
        result.items.length > 0 ? (
          <ul className="mt-4 flex flex-col divide-y divide-line">
            {result.items.map((item) => (
              <li key={item.id} className="py-3">
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="group block">
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="font-mono text-[12px] text-threat">{item.id}</span>
                    {item.severity ? <span className="shrink-0 font-mono text-[10.5px] text-subtle">{item.severity}</span> : null}
                  </span>
                  <span className="mt-1 block text-[13px] leading-snug text-muted transition-colors group-hover:text-foreground">
                    {item.title}
                    <ArrowUpRight aria-hidden className="ml-1 inline size-3 text-subtle" />
                  </span>
                  <span className="mt-1 block font-mono text-[10.5px] text-subtle">
                    {[
                      item.product,
                      item.added ? `added ${item.added}` : undefined,
                      item.published ? `published ${day(item.published)}` : undefined,
                      item.updated && day(item.updated) !== day(item.published) ? `updated ${day(item.updated)}` : undefined,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-muted">The source returned no matching items for this period.</p>
        )
      ) : (
        <p className="mt-4 rounded-md border border-line-strong px-3 py-2.5 text-sm text-muted" role="status">
          Unavailable: {result.reason}. Nothing is shown rather than old or invented data. It retries at the next update.
        </p>
      )}

      <p className="mt-auto pt-4 font-mono text-[10.5px] leading-relaxed text-subtle">
        {result.ok ? "Retrieved " : "Last attempt "}
        <RelativeTime iso={result.retrievedAt} />
        {result.ok && result.sourceVersion ? ` · catalog ${result.sourceVersion}` : null}
      </p>
    </div>
  );
}

/**
 * Real public threat intelligence, fetched on the server when the page is
 * (re)generated, every six hours. Visitors' browsers never call these APIs.
 */
export async function IntelFeed() {
  const results = await Promise.all([fetchKev(), fetchNvd(), fetchGhsa()]);
  return (
    <div className="grid gap-8 lg:grid-cols-3 lg:gap-6">
      {results.map((result) => (
        <Column key={result.source.id} result={result} />
      ))}
    </div>
  );
}
