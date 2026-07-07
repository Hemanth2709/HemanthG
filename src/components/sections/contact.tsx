"use client";

import { ArrowRight, Send } from "lucide-react";
import * as React from "react";

import { Magnetic } from "@/components/effects/magnetic";
import { Reveal } from "@/components/effects/reveal";
import { Icon } from "@/components/ui/icon";
import { site, socials } from "@/data/site";

/**
 * The form composes a pre-filled email — no backend required.
 * Swap `handleSubmit` for a POST to your endpoint when you add one.
 */
export function Contact() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [message, setMessage] = React.useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const subject = encodeURIComponent(`Product idea from ${name || "your website"}`);
    const body = encodeURIComponent(`${message}\n\n— ${name}${email ? ` (${email})` : ""}`);
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
  };

  const inputStyles =
    "w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-foreground placeholder:text-subtle transition-colors duration-300 focus:border-accent/60 focus:outline-none";

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28 md:py-40" aria-label="Contact">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 100%, rgba(139,147,255,0.08), transparent 70%)",
        }}
      />

      <div className="container-site relative">
        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <Reveal className="flex flex-col justify-center">
            <span className="eyebrow mb-6">Contact</span>
            <h2 className="text-balance text-4xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              Have an interesting{" "}
              <em className="font-serif not-italic [font-style:italic] text-gradient">product idea</em>?
            </h2>
            <p className="mt-6 max-w-md text-pretty text-lg leading-relaxed text-muted">
              Let&apos;s build something meaningful. Whether it&apos;s a role, a product, or a problem
              worth solving — my inbox is open.
            </p>

            <div className="mt-10 flex flex-col gap-4">
              <Magnetic className="w-fit">
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex items-center gap-2 text-lg font-medium text-foreground transition-colors hover:text-accent-bright"
                >
                  {site.email}
                  <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                </a>
              </Magnetic>

              <ul className="mt-4 flex items-center gap-2">
                {socials.map((social) => (
                  <li key={social.label}>
                    <a
                      href={social.href}
                      target={social.href.startsWith("http") ? "_blank" : undefined}
                      rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      aria-label={social.label}
                      className="flex size-11 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:text-foreground"
                    >
                      <Icon name={social.icon} className="size-4" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 rounded-3xl border border-line bg-surface/60 p-7 backdrop-blur-sm md:p-9"
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="contact-name" className="mb-2 block text-xs font-medium text-muted">
                    Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="Ada Lovelace"
                    className={inputStyles}
                  />
                </div>
                <div>
                  <label htmlFor="contact-email" className="mb-2 block text-xs font-medium text-muted">
                    Email
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="ada@example.com"
                    className={inputStyles}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="contact-message" className="mb-2 block text-xs font-medium text-muted">
                  What are you building?
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="Tell me about the product, the problem, or the idea…"
                  className={`${inputStyles} resize-none`}
                />
              </div>
              <Magnetic className="mt-2">
                <button
                  type="submit"
                  className="group flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground text-base font-medium text-background transition-all duration-300 hover:bg-accent-bright hover:shadow-[0_0_40px_rgba(139,147,255,0.4)]"
                >
                  Send message
                  <Send className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </button>
              </Magnetic>
              <p className="text-center text-xs text-subtle">
                Opens your email client with the message pre-filled — no data leaves this page.
              </p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
