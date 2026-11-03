"use client";

import { Menu, X } from "lucide-react";
import * as React from "react";

import { Wordmark } from "@/components/layout/wordmark";
import { navigation, site } from "@/data/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const [active, setActive] = React.useState<string>("#home");
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setScrolled(window.scrollY > 12));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  // Active section: the one crossing a line 40% down the viewport.
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
      { rootMargin: "-40% 0px -59% 0px" },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  // Close the mobile menu on Escape.
  React.useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header
      className={cn(
        "anim-fade fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color] duration-300",
        scrolled || open ? "glass border-line" : "border-transparent bg-transparent",
      )}
      style={{ "--enter-delay": "0s", animationDuration: "0.5s" } as React.CSSProperties}
    >
      <nav className="container-site flex h-16 items-center justify-between gap-6" aria-label="Primary">
        <a href="#home" aria-label={`${site.name}, back to top`} className="rounded-md">
          <Wordmark />
        </a>

        <ul className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => {
            const isActive = active === item.href;
            return (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isActive ? "true" : undefined}
                  className={cn(
                    "group relative py-2 text-[13px] transition-colors duration-200",
                    isActive ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute inset-x-0 -bottom-0.5 h-px origin-left bg-accent transition-transform duration-300 ease-out",
                      isActive ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100 group-hover:bg-line-strong",
                    )}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="hidden lg:block">
          {site.resumeUrl ? (
            <a
              href={site.resumeUrl}
              className="inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-[13px] text-foreground transition-colors duration-200 hover:border-accent/60"
            >
              Resume
            </a>
          ) : (
            <a
              href={`mailto:${site.email}`}
              className="inline-flex h-9 items-center rounded-full border border-line-strong px-4 text-[13px] text-foreground transition-colors duration-200 hover:border-accent/60"
            >
              Email me
            </a>
          )}
        </div>

        <button
          type="button"
          className="-mr-2 rounded-md p-2 text-muted transition-colors hover:text-foreground lg:hidden"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <div
        id="mobile-menu"
        className={cn(
          "grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
        inert={!open}
      >
        <div className="overflow-hidden">
          <ul className="container-site flex flex-col pb-5">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center justify-between border-t border-line py-3.5 text-[15px] transition-colors",
                    active === item.href ? "text-foreground" : "text-muted hover:text-foreground",
                  )}
                >
                  {item.label}
                  {active === item.href ? <span aria-hidden className="size-1.5 rounded-full bg-accent" /> : null}
                </a>
              </li>
            ))}
            <li>
              <a
                href={site.resumeUrl ?? `mailto:${site.email}`}
                className="mt-3 flex h-11 items-center justify-center rounded-full bg-foreground text-sm font-medium text-background"
              >
                {site.resumeUrl ? "Resume" : "Email me"}
              </a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
