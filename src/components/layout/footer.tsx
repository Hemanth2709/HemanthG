import { ArrowUp } from "lucide-react";

import { Wordmark } from "@/components/layout/wordmark";
import { site, socials } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-site grid gap-10 py-12 md:grid-cols-12 md:items-end">
        <div className="md:col-span-6">
          <Wordmark />
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{site.description}</p>
        </div>
        <ul className="flex gap-6 text-sm md:col-span-3">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted transition-colors duration-200 hover:text-foreground"
              >
                {social.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex items-center justify-between gap-6 text-xs text-subtle md:col-span-3 md:justify-end">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <a
            href="#home"
            className="group inline-flex items-center gap-1.5 transition-colors duration-200 hover:text-foreground"
          >
            Back to top
            <ArrowUp className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
