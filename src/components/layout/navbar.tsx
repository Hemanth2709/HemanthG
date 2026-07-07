"use client";

import { Menu, X } from "lucide-react";
import * as React from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { navigation, site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState<string>("");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 24));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Track which section is in view for the active indicator.
  React.useEffect(() => {
    const sections = navigation
      .map((item) => document.getElementById(item.href.slice(1)))
      .filter((el): el is HTMLElement => el !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(`#${entry.target.id}`);
        }
      },
      { rootMargin: "-35% 0px -55% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled ? "glass border-b border-line" : "bg-transparent",
      )}
    >
      <nav className="container-site flex h-16 items-center justify-between" aria-label="Primary">
        <a
          href="#"
          className="font-mono text-sm font-semibold tracking-[0.3em] text-foreground transition-colors hover:text-accent-bright"
          aria-label={`${site.initials} — ${site.name}, back to top`}
        >
          {site.initials}
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <li key={item.href}>
              <a
                href={item.href}
                aria-current={active === item.href ? "true" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm transition-colors duration-300",
                  active === item.href
                    ? "bg-white/[0.06] text-foreground"
                    : "text-muted hover:bg-white/[0.03] hover:text-foreground",
                )}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <Magnetic className="hidden md:block">
          <a
            href="#contact"
            className="inline-flex h-9 items-center rounded-full bg-foreground px-5 text-sm font-medium text-background transition-all duration-300 hover:bg-accent-bright hover:shadow-[0_0_24px_rgba(139,147,255,0.35)]"
          >
            Get in touch
          </a>
        </Magnetic>

        <button
          type="button"
          className="rounded-md p-2 text-muted transition-colors hover:text-foreground md:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      {/* Mobile menu: CSS grid-rows transition — no animation library */}
      <div
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out md:hidden",
          open ? "glass grid-rows-[1fr] border-b border-line opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <ul className="container-site flex flex-col gap-1 py-4">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-3 text-sm transition-colors",
                    active === item.href
                      ? "bg-white/[0.06] text-foreground"
                      : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="mt-2 block rounded-lg bg-foreground px-4 py-3 text-center text-sm font-medium text-background"
              >
                Get in touch
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
