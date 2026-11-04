import type { ComponentDef, ComponentKind } from "./types";

const SR = "https://github.com/Hemanth2709/SentinelRules/blob/main/docs/features";

/** Every component a visitor can place, with its explanation panel. */
export const CATALOGUE: Record<ComponentKind, ComponentDef> = {
  client: {
    kind: "client",
    label: "Browser",
    tech: "Visitor or attacker",
    zone: "internet",
    explain: {
      what: "Anyone on the internet sending HTTP requests: a real user's browser, or a script crafting requests by hand.",
      why: "Everything that arrives from here is untrusted input, however the UI constrains it. An attacker skips the UI entirely.",
      example: "A crafted request with a modified query string, body or header, sent with curl instead of the site's form.",
      risks: ["Malicious input in any field", "Automated request floods", "Stolen session tokens replayed"],
      defences: ["Validate and encode on the server, never only in the browser", "Authenticate and authorize every request"],
    },
  },
  cdn: {
    kind: "cdn",
    label: "CDN",
    tech: "Edge cache",
    zone: "edge",
    explain: {
      what: "A content delivery network that serves cached responses from locations close to users and absorbs traffic before it reaches the origin.",
      why: "It takes load off the application and is the first place volumetric traffic can be dropped.",
      example: "Static pages and images served from the edge, so a traffic spike never reaches the origin servers.",
      risks: ["Caching private responses for the wrong user", "Origin reachable directly, bypassing the CDN"],
      defences: ["Cache only public responses (Cache-Control)", "Restrict the origin to accept traffic from the CDN only"],
    },
  },
  waf: {
    kind: "waf",
    label: "WAF",
    tech: "Web application firewall",
    zone: "edge",
    explain: {
      what: "A filter in front of the application that inspects requests and blocks ones matching known attack patterns.",
      why: "It stops a lot of commodity attacks cheaply and buys time to fix the code.",
      example: "A managed rule set that rejects requests containing common SQL-injection or XSS payloads.",
      risks: ["Bypass with encoding or unusual syntax", "False positives blocking real users", "A false sense of security"],
      defences: ["Treat it as one layer, not the fix", "Keep rules updated and monitor what it blocks"],
      owasp: ["A05:2021 Security Misconfiguration (when misconfigured)"],
    },
  },
  gateway: {
    kind: "gateway",
    label: "API gateway",
    tech: "Routing, auth, rate limits",
    zone: "edge",
    explain: {
      what: "A single entry point for APIs that routes requests, checks tokens and applies limits before traffic reaches services.",
      why: "Cross-cutting controls live in one place instead of being reimplemented in every service.",
      example: "The gateway rejects requests without a valid token and limits each client to 100 requests per minute.",
      risks: ["Services reachable without going through the gateway", "Checks that only verify a token exists, not what it allows"],
      defences: ["Make services private to the network", "Enforce authorization in the service as well"],
    },
  },
  web: {
    kind: "web",
    label: "Web app",
    tech: "Next.js",
    zone: "app",
    explain: {
      what: "The server-rendered front end: pages, route handlers and Server Actions.",
      why: "It turns data into HTML. If that data is attacker-controlled and rendered unsafely, the attacker's script runs in other users' browsers.",
      example: "A product review rendered with dangerouslySetInnerHTML without sanitizing it first.",
      risks: ["Cross-site scripting", "Secrets exposed through NEXT_PUBLIC_ variables", "Route handlers without an auth check"],
      defences: ["Let React escape output; sanitize any HTML you must render", "Content-Security-Policy", "Auth checks in every mutating handler"],
      cwe: ["CWE-79"],
      owasp: ["A03:2021 Injection"],
      related: { label: "Sentinel rule: unsafe HTML", href: `${SR}/05-unsafe-html/README.md` },
    },
  },
  api: {
    kind: "api",
    label: "API service",
    tech: "NestJS",
    zone: "app",
    explain: {
      what: "The backend that holds business logic: controllers, services and the queries they run.",
      why: "Most serious application vulnerabilities live here, where request data meets the database and other systems.",
      example: "A search endpoint that builds SQL by concatenating the search term into the query string.",
      risks: ["SQL injection", "Missing object-level authorization (IDOR)", "Server-side request forgery", "Mass assignment"],
      defences: ["Parameterized queries", "Check the caller owns the object", "Validate input with a whitelist", "SAST in CI"],
      cwe: ["CWE-89", "CWE-639", "CWE-918", "CWE-915"],
      owasp: ["A03:2021 Injection", "A01:2021 Broken Access Control", "A10:2021 SSRF"],
      related: { label: "Sentinel rule: SQL injection", href: `${SR}/01-sql-injection/README.md` },
    },
  },
  auth: {
    kind: "auth",
    label: "Identity provider",
    tech: "OAuth 2.0 / JWT",
    zone: "app",
    explain: {
      what: "The service that signs users in and issues tokens other services trust.",
      why: "If token verification is weak, every service that trusts the token is exposed.",
      example: "A service that verifies JWTs with ignoreExpiration: true, so a leaked token never stops working.",
      risks: ["Expired or forged tokens accepted", "Algorithm confusion", "Over-broad scopes or roles"],
      defences: ["Pin the signing algorithm", "Enforce expiry and audience", "Least-privilege roles"],
      cwe: ["CWE-347", "CWE-613"],
      owasp: ["A07:2021 Identification and Authentication Failures"],
      related: { label: "Sentinel rule: JWT misconfiguration", href: `${SR}/02-jwt-misconfiguration/README.md` },
    },
  },
  db: {
    kind: "db",
    label: "Database",
    tech: "PostgreSQL",
    zone: "data",
    explain: {
      what: "Where the application's data lives: users, orders, sessions.",
      why: "It is usually the attacker's real target, and the account the application uses decides how much damage one flaw can do.",
      example: "The application connects as a superuser, so an injection can read every table and drop them.",
      risks: ["Data theft or tampering through injection", "Over-privileged application account", "Unencrypted backups"],
      defences: ["Least-privilege database role", "Encryption at rest", "Parameterized queries in the code that calls it"],
      cwe: ["CWE-89", "CWE-250"],
      owasp: ["A03:2021 Injection"],
    },
  },
  cache: {
    kind: "cache",
    label: "Cache",
    tech: "Redis",
    zone: "data",
    explain: {
      what: "An in-memory store for sessions, rate-limit counters and hot data.",
      why: "It often holds session tokens and is frequently deployed without authentication on a private network.",
      example: "A Redis instance reachable from the application network with no password set.",
      risks: ["Session theft if reachable", "Cache poisoning"],
      defences: ["Require auth and TLS", "Keep it on a private network segment"],
    },
  },
  secrets: {
    kind: "secrets",
    label: "Secrets manager",
    tech: "Vault / AWS Secrets Manager",
    zone: "platform",
    explain: {
      what: "A store that hands credentials to services at runtime instead of baking them into code or images.",
      why: "Credentials in repositories, images or client bundles are among the most common causes of breaches.",
      example: "A database password committed to Git, or an API key in a NEXT_PUBLIC_ variable shipped to every browser.",
      risks: ["Secrets in source, logs or client bundles", "Long-lived keys that are never rotated"],
      defences: ["Fetch secrets at runtime with scoped IAM", "Rotate keys", "Secret scanning in CI"],
      cwe: ["CWE-798", "CWE-200"],
      owasp: ["A07:2021 Identification and Authentication Failures", "A05:2021 Security Misconfiguration"],
      related: { label: "Sentinel rule: public secrets", href: `${SR}/04-next-public-secrets/README.md` },
    },
  },
  container: {
    kind: "container",
    label: "Container runtime",
    tech: "Docker / Kubernetes",
    zone: "platform",
    explain: {
      what: "The image and runtime the services run in, usually scheduled by Kubernetes.",
      why: "A vulnerable base image or an over-privileged pod turns an application bug into a host compromise.",
      example: "A container running as root with the host's Docker socket mounted.",
      risks: ["Known CVEs in base images", "Privileged containers", "Over-broad service-account permissions"],
      defences: ["Image scanning in CI", "Run as non-root", "Least-privilege service accounts"],
      cwe: ["CWE-250", "CWE-1104"],
      owasp: ["A06:2021 Vulnerable and Outdated Components"],
    },
  },
  monitor: {
    kind: "monitor",
    label: "Runtime monitoring",
    tech: "Logs, metrics, alerts",
    zone: "platform",
    explain: {
      what: "Collection of logs, metrics and traces, with alerts on suspicious behaviour.",
      why: "Prevention fails eventually. Detection decides whether an attack is noticed in minutes or months.",
      example: "An alert when one client triggers hundreds of database errors in a minute.",
      risks: ["No alerting on security events", "Logs that capture secrets or personal data"],
      defences: ["Alert on authentication failures and error spikes", "Redact sensitive fields"],
      owasp: ["A09:2021 Security Logging and Monitoring Failures"],
    },
  },
};

export const PALETTE_ORDER: ComponentKind[] = [
  "client",
  "cdn",
  "waf",
  "gateway",
  "web",
  "api",
  "auth",
  "db",
  "cache",
  "secrets",
  "container",
  "monitor",
];

/**
 * Which connections make architectural sense (source → targets). Used to
 * validate new connections so the graph stays meaningful.
 */
export const CONNECTS_TO: Record<ComponentKind, ComponentKind[]> = {
  client: ["cdn", "waf", "gateway", "web"],
  cdn: ["waf", "gateway", "web"],
  waf: ["gateway", "web", "api"],
  gateway: ["api", "auth", "web"],
  web: ["api", "auth", "gateway"],
  api: ["db", "cache", "auth", "secrets", "api"],
  auth: ["db", "cache", "secrets"],
  db: [],
  cache: [],
  secrets: [],
  container: ["web", "api", "auth"],
  monitor: ["web", "api", "auth", "db", "gateway", "waf", "container"],
};

export function canConnect(source: ComponentKind, target: ComponentKind): boolean {
  return CONNECTS_TO[source].includes(target);
}
