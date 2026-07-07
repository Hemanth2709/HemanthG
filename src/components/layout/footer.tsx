import { Icon } from "@/components/ui/icon";
import { site, socials } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-site flex flex-col items-center justify-between gap-6 py-10 md:flex-row">
        <div className="flex flex-col items-center gap-1 md:items-start">
          <span className="font-mono text-sm tracking-[0.3em] text-foreground">{site.initials}</span>
          <p className="text-sm text-subtle">
            © {new Date().getFullYear()} {site.name}. Designed and built from scratch.
          </p>
        </div>
        <ul className="flex items-center gap-2">
          {socials.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target={social.href.startsWith("http") ? "_blank" : undefined}
                rel={social.href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={social.label}
                className="flex size-10 items-center justify-center rounded-full border border-line text-muted transition-all duration-300 hover:border-accent/50 hover:text-foreground"
              >
                <Icon name={social.icon} className="size-4" />
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
