"use client";

import { ArrowUpRight } from "lucide-react";
import * as React from "react";

import { Reveal } from "@/components/effects/reveal";
import { Icon } from "@/components/ui/icon";
import { site, socials } from "@/data/site";

/** The form composes a pre-filled email. Nothing is sent from this page. */
export function Contact() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n${name}${email ? ` (${email})` : ""}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const inputStyles =
    "w-full rounded-md border border-line-strong bg-surface px-3.5 py-2.5 text-sm text-foreground placeholder:text-subtle transition-colors focus:border-accent focus:outline-none";

  return (
    <section id="contact" className="scroll-mt-20 border-t border-line py-24 md:py-32" aria-label="Contact">
      <div className="container-site grid gap-14 lg:grid-cols-2 lg:gap-20">
        <Reveal>
          <span className="eyebrow">Contact</span>
          <h2 className="mt-4 text-balance text-3xl font-semibold tracking-tight text-foreground md:text-4xl">
            Get in touch
          </h2>
          <p className="mt-5 max-w-md text-pretty leading-relaxed text-muted">
            Questions about Sentinel-Security, a false positive you hit, or an application security role. Email is
            the quickest way to reach me.
          </p>

          <a
            href={`mailto:${site.email}`}
            className="mt-8 inline-flex items-center gap-1.5 font-mono text-sm text-foreground underline decoration-line-strong underline-offset-4 transition-colors hover:text-accent-bright hover:decoration-accent"
          >
            {site.email}
          </a>

          <ul className="mt-8 flex flex-col gap-2">
            {socials
              .filter((social) => social.icon !== "mail")
              .map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-foreground"
                  >
                    <Icon name={social.icon} className="size-4" />
                    {social.label}
                    <ArrowUpRight className="size-3.5 text-subtle transition-colors group-hover:text-foreground" />
                  </a>
                </li>
              ))}
          </ul>
        </Reveal>

        <Reveal delay={0.08}>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 rounded-lg border border-line bg-surface/50 p-6 md:p-8">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="contact-name" className="mb-1.5 block text-xs text-muted">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  autoComplete="name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className={inputStyles}
                />
              </div>
              <div>
                <label htmlFor="contact-email" className="mb-1.5 block text-xs text-muted">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className={inputStyles}
                />
              </div>
            </div>
            <div>
              <label htmlFor="contact-message" className="mb-1.5 block text-xs text-muted">
                Message
              </label>
              <textarea
                id="contact-message"
                required
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                className={`${inputStyles} resize-y`}
              />
            </div>
            <button
              type="submit"
              className="mt-1 inline-flex h-11 items-center justify-center rounded-md bg-foreground px-5 text-sm font-medium text-background transition-colors hover:bg-accent-bright"
            >
              Open in email
            </button>
            <p className="text-xs text-subtle">This opens your email app with the message filled in.</p>
          </form>
        </Reveal>
      </div>
    </section>
  );
}
