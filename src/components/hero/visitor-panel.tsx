"use client";

import { Crosshair } from "lucide-react";
import { useEffect, useState } from "react";

import type { VisitorDevice, VisitorNetwork } from "@/lib/visitor/types";
import { parseUserAgent } from "@/lib/visitor/user-agent";
import { cn } from "@/lib/utils";

const TIMEOUT_MS = 5000;
const UNAVAILABLE = "Unavailable";

type NetworkState = { status: "loading" } | { status: "done"; data: VisitorNetwork } | { status: "failed" };

interface NetworkInformationLike {
  type?: string;
  effectiveType?: string;
}

function readDevice(): VisitorDevice {
  const agent = parseUserAgent(navigator.userAgent);
  const connection = (navigator as Navigator & { connection?: NetworkInformationLike }).connection;
  let timezone: string | null = null;
  try {
    timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || null;
  } catch {
    timezone = null;
  }
  return {
    browser: agent.browser,
    browserVersion: agent.version,
    os: agent.os,
    screen: window.screen?.width ? `${window.screen.width} × ${window.screen.height}` : null,
    viewport: `${window.innerWidth} × ${window.innerHeight}`,
    pixelRatio: window.devicePixelRatio ? `${Number(window.devicePixelRatio.toFixed(2))}×` : null,
    language: navigator.language || null,
    timezone,
    connection:
      connection?.type && connection.type !== "unknown"
        ? connection.type
        : connection?.effectiveType
          ? `${connection.effectiveType} (effective)`
          : null,
  };
}

function countryName(code: string | null): string | null {
  if (!code) return null;
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

function locationText(data: VisitorNetwork): string | null {
  const parts = [data.city, data.region, countryName(data.countryCode)].filter(Boolean);
  return parts.length ? parts.join(", ") : null;
}

function Field({ label, value, pending, wide }: { label: string; value: string | null; pending: boolean; wide?: boolean }) {
  return (
    <div className={cn("min-w-0", wide && "col-span-2")}>
      <dt className="font-mono text-[10px] tracking-[0.16em] text-subtle uppercase">{label}</dt>
      <dd className={cn("mt-1 truncate text-[13px]", value ? "text-foreground" : "text-muted")}>
        {pending ? <span className="inline-block h-3 w-20 animate-pulse rounded-sm bg-line-strong align-middle" /> : (value ?? UNAVAILABLE)}
      </dd>
    </div>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] tracking-[0.2em] text-cyan/80 uppercase">{title}</p>
      <dl className="mt-2.5 grid grid-cols-2 gap-x-5 gap-y-3 sm:grid-cols-3">{children}</dl>
    </div>
  );
}

/**
 * Shows visitors their own browsing environment. The network part comes
 * from /api/visitor (Vercel's edge headers, never cached, never stored);
 * the device part is read in the browser and never leaves it. No cookies,
 * no storage, no third-party calls, no permission prompts.
 */
export function VisitorPanel() {
  const [device, setDevice] = useState<VisitorDevice | null>(null);
  const [network, setNetwork] = useState<NetworkState>({ status: "loading" });

  useEffect(() => {
    setDevice(readDevice());
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setDevice(readDevice()));
    };
    window.addEventListener("resize", onResize);

    const controller = new AbortController();
    const timer = window.setTimeout(() => controller.abort(), TIMEOUT_MS);
    fetch("/api/visitor", { cache: "no-store", signal: controller.signal })
      .then((response) => (response.ok ? (response.json() as Promise<VisitorNetwork>) : Promise.reject(new Error(String(response.status)))))
      .then((data) => setNetwork({ status: "done", data }))
      .catch(() => {
        if (!controller.signal.aborted || controller.signal.reason !== "unmount") setNetwork({ status: "failed" });
      })
      .finally(() => window.clearTimeout(timer));

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
      window.clearTimeout(timer);
      controller.abort("unmount");
    };
  }, []);

  const collecting = device === null || network.status === "loading";
  const data = network.status === "done" ? network.data : null;
  const location = data ? locationText(data) : null;
  const browser = device?.browser ? `${device.browser}${device.browserVersion ? ` ${device.browserVersion}` : ""}` : null;

  return (
    <section
      aria-labelledby="visitor-intel-title"
      className="relative overflow-hidden rounded-xl border border-line-strong/80 bg-surface/55 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur-md"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan/40 to-transparent"
      />
      <header className="flex items-center justify-between gap-4 border-b border-line px-5 py-3">
        <h2 id="visitor-intel-title" className="flex items-center gap-2 font-mono text-[11px] font-medium tracking-[0.2em] text-foreground uppercase">
          <Crosshair className="size-3.5 text-cyan" aria-hidden />
          Visitor intelligence
        </h2>
        <p role="status" className="flex items-center gap-1.5 font-mono text-[10.5px] tracking-[0.16em] uppercase">
          {collecting ? (
            <span className="text-subtle normal-case tracking-normal">Collecting environment information...</span>
          ) : (
            <>
              <span className="relative flex size-1.5">
                <span className="hero-anim absolute inline-flex size-full animate-ping rounded-full bg-success/60" />
                <span className="relative inline-flex size-1.5 rounded-full bg-success" />
              </span>
              <span className="text-success">Live</span>
            </>
          )}
        </p>
      </header>

      <div className="grid gap-5 px-5 py-4">
        <Group title="Network">
          <Field label="Public IP" value={data?.ip ?? null} pending={network.status === "loading"} />
          <Field
            label="Approx. location"
            value={location ?? (network.status === "loading" ? null : "Location unavailable")}
            pending={network.status === "loading"}
            wide
          />
        </Group>
        <Group title="Device">
          <Field label="Browser" value={browser} pending={device === null} />
          <Field label="Operating system" value={device?.os ?? null} pending={device === null} />
          <Field label="Language" value={device?.language ?? null} pending={device === null} />
        </Group>
        <Group title="Environment">
          <Field label="Screen" value={device?.screen ?? null} pending={device === null} />
          <Field label="Viewport" value={device?.viewport ?? null} pending={device === null} />
          <Field label="Pixel ratio" value={device?.pixelRatio ?? null} pending={device === null} />
          <Field label="Timezone" value={device?.timezone ?? null} pending={device === null} />
          <Field label="Connection" value={device?.connection ?? null} pending={device === null} />
        </Group>
      </div>

      <footer className="border-t border-line px-5 py-3 text-[11.5px] leading-relaxed text-subtle">
        Location is approximate and IP-derived. No visitor information is stored by this site.
      </footer>
    </section>
  );
}
