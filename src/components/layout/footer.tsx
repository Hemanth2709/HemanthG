import { site } from "@/data/site";

export function Footer() {
  return (
    <footer className="border-t border-line">
      <div className="container-site flex flex-col gap-2 py-8 text-xs text-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name}
        </p>
        <p>Built with Next.js. Scanned by Sentinel-Security on every push.</p>
      </div>
    </footer>
  );
}
