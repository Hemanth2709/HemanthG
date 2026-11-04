"use client";

import { ArrowUpRight } from "lucide-react";

import { CATALOGUE } from "@/lib/threatscape/catalogue";
import { CONTROLS } from "@/lib/threatscape/controls";
import type { ComponentKind, ControlId, Effect, Evaluation, Outcome, ScenarioDef } from "@/lib/threatscape/types";
import { cn } from "@/lib/utils";

export const OUTCOME: Record<Outcome, { label: string; tone: string; text: string }> = {
  "no-path": {
    label: "No path",
    tone: "text-muted border-line-strong",
    text: "In this architecture the attack cannot reach its target. Reconnect the components to see the path again.",
  },
  open: { label: "Attack succeeds", tone: "text-threat border-threat/50", text: "Nothing on the path stops or limits this attack." },
  detected: {
    label: "Detected, not prevented",
    tone: "text-warn border-warn/40",
    text: "Monitoring raises an alert, but the attack still succeeds.",
  },
  reduced: {
    label: "Impact reduced",
    tone: "text-defence border-defence/40",
    text: "Controls on the path make the attack harder or limit what it can reach. The root cause is still there.",
  },
  blocked: {
    label: "Blocked",
    tone: "text-defence border-defence",
    text: "A control on the path stops the attack before it reaches the target. Other layers still matter: no single control makes a system secure.",
  },
};

const EFFECT_LABEL: Record<Effect, string> = { blocks: "Blocks", reduces: "Reduces", detects: "Detects" };

function Links({ items }: { items: { label: string; href: string }[] }) {
  if (items.length === 0) return null;
  return (
    <ul className="mt-4 flex flex-col gap-1.5">
      {items.map((item) => (
        <li key={item.href}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-1 text-sm text-foreground underline decoration-line-strong underline-offset-4 hover:text-accent-bright hover:decoration-accent"
          >
            {item.label}
            <ArrowUpRight className="size-3.5 text-subtle group-hover:text-accent-bright" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Field({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">{title}</h4>
      <div className="mt-1.5 text-sm leading-relaxed text-muted">{children}</div>
    </div>
  );
}

/** "What it is, why it matters, example, risks, defences, CWE/OWASP, related" for one component. */
export function ExplainerPanel({ kind }: { kind: ComponentKind }) {
  const def = CATALOGUE[kind];
  const e = def.explain;
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-mono text-[11px] text-subtle">{def.tech}</p>
        <h3 className="font-display text-xl font-medium text-foreground">{def.label}</h3>
      </div>
      <Field title="What it is">{e.what}</Field>
      <Field title="Why it matters">{e.why}</Field>
      <Field title="Example">{e.example}</Field>
      <Field title="Risks">
        <ul className="list-disc pl-4">
          {e.risks.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>
      </Field>
      <Field title="Defensive practice">
        <ul className="list-disc pl-4">
          {e.defences.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Field>
      {e.cwe || e.owasp ? (
        <Field title="Mappings">
          <span className="font-mono text-xs">{[...(e.cwe ?? []), ...(e.owasp ?? [])].join(" · ")}</span>
        </Field>
      ) : null}
      <Links items={e.related ? [e.related] : []} />
    </div>
  );
}

export function OutcomeBadge({ outcome }: { outcome: Outcome }) {
  const o = OUTCOME[outcome];
  return (
    <div className={cn("rounded-md border px-3 py-2.5", o.tone)} role="status" aria-live="polite">
      <p className="font-mono text-[11px] uppercase tracking-[0.14em]">{o.label}</p>
      <p className="mt-1 text-sm leading-relaxed text-muted">{o.text}</p>
    </div>
  );
}

/** Scenario summary and the step-by-step path through the current architecture. */
export function ScenarioPanel({
  scenario,
  evaluation,
  activeStep,
  onStep,
}: {
  scenario: ScenarioDef;
  evaluation: Evaluation;
  activeStep?: number;
  onStep?: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="font-mono text-[11px] text-threat">{[...scenario.cwe, ...scenario.owasp].join(" · ")}</p>
        <h3 className="font-display text-xl font-medium text-foreground">{scenario.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{scenario.summary}</p>
      </div>
      <OutcomeBadge outcome={evaluation.outcome} />
      <Field title="Preconditions">
        <ul className="list-disc pl-4">
          {scenario.preconditions.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </Field>
      {evaluation.steps.length > 0 ? (
        <div>
          <h4 className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Attack path in this architecture</h4>
          <ol className="mt-2 flex flex-col gap-1.5">
            {evaluation.steps.map((step, index) => (
              <li key={step.nodeId}>
                <button
                  type="button"
                  onClick={() => onStep?.(index)}
                  aria-current={activeStep === index ? "step" : undefined}
                  className={cn(
                    "w-full rounded-md border px-3 py-2 text-left transition-colors",
                    activeStep === index ? "border-threat/60 bg-threat-dim" : "border-line hover:border-line-strong",
                    step.unreached && "opacity-50",
                  )}
                >
                  <span className="flex items-baseline gap-2">
                    <span className="font-mono text-[10.5px] text-threat">{String(index + 1).padStart(2, "0")}</span>
                    <span className="text-[13px] font-medium text-foreground">{CATALOGUE[step.kind].label}</span>
                    {step.unreached ? <span className="ml-auto font-mono text-[10px] text-subtle">not reached</span> : null}
                  </span>
                  {activeStep === index ? (
                    <span className="mt-1.5 block text-sm leading-relaxed text-muted">
                      {step.text}
                      {step.sample ? (
                        <code className="mt-1.5 block rounded bg-background px-2 py-1 font-mono text-[11.5px] break-all text-foreground/90">
                          {step.sample}
                        </code>
                      ) : null}
                      {step.effects.map((effect) => (
                        <span key={effect.control} className="mt-1.5 block text-defence">
                          {EFFECT_LABEL[effect.effect]} · {CONTROLS[effect.control].label}: <span className="text-muted">{effect.note}</span>
                        </span>
                      ))}
                    </span>
                  ) : null}
                </button>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      <Field title="Potential impact">{scenario.impact}</Field>
      <p className="text-xs text-subtle">Simulation only: synthetic requests, nothing is sent anywhere.</p>
      <Links items={scenario.related ? [scenario.related] : []} />
    </div>
  );
}

/** Toggle defensive controls for the scenario; each states what it reduces and what it does not solve. */
export function ControlsPanel({
  scenario,
  applied,
  inactive,
  onToggle,
}: {
  scenario: ScenarioDef;
  applied: ReadonlySet<ControlId>;
  inactive: ControlId[];
  onToggle: (id: ControlId) => void;
}) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-subtle">Defensive controls</legend>
      {scenario.controls.map((item) => {
        const control = CONTROLS[item.control];
        const on = applied.has(item.control);
        const idle = on && inactive.includes(item.control);
        return (
          <label
            key={item.control}
            className={cn(
              "flex cursor-pointer gap-3 rounded-md border px-3 py-2.5 transition-colors",
              on ? "border-defence/50 bg-defence-dim" : "border-line hover:border-line-strong",
            )}
          >
            <input
              type="checkbox"
              checked={on}
              onChange={() => onToggle(item.control)}
              className="mt-1 size-3.5 shrink-0 accent-[var(--color-defence)]"
            />
            <span className="text-sm leading-relaxed">
              <span className="flex flex-wrap items-baseline gap-x-2">
                <span className="font-medium text-foreground">{control.label}</span>
                <span className="font-mono text-[10.5px] uppercase text-defence">{EFFECT_LABEL[item.effect]}</span>
                {idle ? (
                  <span className="font-mono text-[10.5px] text-warn">
                    no {CATALOGUE[control.appliesTo].label.toLowerCase()} on the path
                  </span>
                ) : null}
              </span>
              <span className="mt-0.5 block text-muted">{control.summary}</span>
              {on ? (
                <>
                  <span className="mt-1 block text-muted">
                    <span className="text-foreground/80">Reduces:</span> {control.reduces}
                  </span>
                  <span className="mt-0.5 block text-muted">
                    <span className="text-foreground/80">Does not solve:</span> {control.doesNotSolve}
                  </span>
                </>
              ) : null}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
