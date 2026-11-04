export interface ParsedAgent {
  browser: string | null;
  /** Major version only: modern browsers freeze the minor parts. */
  version: string | null;
  os: string | null;
}

const BROWSERS: [RegExp, string][] = [
  [/Edg(?:e|A|iOS)?\/(\d+)/, "Edge"],
  [/OPR\/(\d+)/, "Opera"],
  [/SamsungBrowser\/(\d+)/, "Samsung Internet"],
  [/(?:Firefox|FxiOS)\/(\d+)/, "Firefox"],
  [/(?:Chrome|CriOS)\/(\d+)/, "Chrome"],
  [/Version\/(\d+)[\d.]* (?:Mobile\/\S+ )?Safari\//, "Safari"],
];

/**
 * Name the browser and operating system from the User-Agent string, for
 * display back to the same visitor. Deliberately coarse: OS versions are
 * not shown because browsers freeze them (Windows 11 reports as 10, macOS
 * as 10.15.7, Android as 10), so showing them would be wrong.
 */
export function parseUserAgent(ua: string): ParsedAgent {
  let browser: string | null = null;
  let version: string | null = null;
  for (const [pattern, name] of BROWSERS) {
    const match = pattern.exec(ua);
    if (match) {
      browser = name;
      version = match[1] ?? null;
      break;
    }
  }

  let os: string | null = null;
  if (/Windows NT/.test(ua)) os = "Windows";
  else if (/iPad/.test(ua)) os = "iPadOS";
  else if (/iPhone|iPod/.test(ua)) os = "iOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/CrOS/.test(ua)) os = "ChromeOS";
  else if (/Mac OS X|Macintosh/.test(ua)) os = "macOS";
  else if (/Linux/.test(ua)) os = "Linux";

  return { browser, version, os };
}
