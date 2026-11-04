import { ArrowUpRight } from "lucide-react";

import { Reveal } from "@/components/effects/reveal";
import { CopyEmail } from "@/components/sections/copy-email";
import { Icon } from "@/components/ui/icon";
import { site, socials } from "@/data/site";

export function Contact() {
  return (
    <section id="contact" className="relative scroll-mt-20 overflow-hidden border-t border-line py-24 md:py-40" aria-label="Contact">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-96"
        style={{ background: "radial-gradient(ellipse 50% 70% at 20% 100%, rgba(101,169,255,0.06), transparent 70%)" }}
      />

      <div className="container-site relative">
        <Reveal>
          <p className="label flex items-center gap-3">
            <span className="text-accent">04</span>
            <span aria-hidden className="h-px w-8 bg-line-strong" />
            Contact
          </p>
          <h2 className="mt-6 max-w-4xl text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.035em] text-foreground md:text-7xl">
            Have an interesting engineering problem?
          </h2>
          <p className="mt-7 max-w-2xl text-pretty text-base leading-relaxed text-muted md:text-lg">
            I'm looking for cloud, DevOps and full stack roles where I own infrastructure as well as code, remote or in
            Bengaluru. Longer term I'm building towards security, starting with identity and access management and
            DevSecOps.
          </p>
        </Reveal>

        <Reveal delay={0.08} className="mt-14">
          <CopyEmail email={site.email} />
        </Reveal>

        <Reveal delay={0.12}>
          <ul className="mt-14 grid border-t border-line sm:grid-cols-3">
            {socials.map((social) => (
              <li key={social.label} className="border-b border-line sm:border-r sm:last:border-r-0">
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between gap-4 py-6 transition-colors duration-200 sm:px-6 sm:first:pl-0"
                >
                  <span className="flex items-center gap-3">
                    <Icon name={social.icon} className="size-4 text-subtle transition-colors group-hover:text-accent" />
                    <span>
                      <span className="block text-sm text-foreground">{social.label}</span>
                      <span className="block font-mono text-xs text-subtle">{social.handle}</span>
                    </span>
                  </span>
                  <ArrowUpRight className="size-4 text-subtle transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
                </a>
              </li>
            ))}
            <li className="border-b border-line sm:px-6">
              {site.resumeUrl ? (
                <a
                  href={site.resumeUrl}
                  className="group flex items-center justify-between gap-4 py-6 text-sm text-foreground"
                >
                  Resume (PDF)
                  <ArrowUpRight className="size-4 text-subtle group-hover:text-foreground" />
                </a>
              ) : (
                <div className="py-6">
                  <span className="block text-sm text-foreground">Location</span>
                  <span className="block font-mono text-xs text-subtle">{site.location} · open to remote</span>
                </div>
              )}
            </li>
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
