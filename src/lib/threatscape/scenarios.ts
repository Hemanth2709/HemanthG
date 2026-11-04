import type { ScenarioDef, ScenarioId } from "./types";

const SR = "https://github.com/Hemanth2709/SentinelRules/blob/main/docs/features";

/**
 * Simulated attack scenarios. Every payload is a synthetic, illustrative
 * string; nothing here sends a request anywhere.
 */
export const SCENARIOS: Partial<Record<ScenarioId, ScenarioDef>> = {
  "sql-injection": {
    id: "sql-injection",
    title: "SQL injection",
    summary: "A search term is concatenated into a SQL query, so the attacker's input becomes part of the query itself.",
    cwe: ["CWE-89"],
    owasp: ["A03:2021 Injection"],
    entry: "client",
    target: "db",
    preconditions: [
      "The API builds a query by concatenating or interpolating request data",
      "The API can reach the database",
    ],
    impact: "Reading or changing data the user should never see: other users' records, password hashes, or whole tables, depending on the database role.",
    steps: [
      { kind: "client", text: "The attacker puts SQL syntax in a search field instead of a product name.", sample: "GET /api/products?q=' OR '1'='1" },
      { kind: "cdn", text: "The request is not cacheable, so the CDN forwards it to the origin." },
      { kind: "waf", text: "The request passes through the WAF." },
      { kind: "gateway", text: "The gateway routes the request; the token is valid, so it is allowed." },
      { kind: "web", text: "The web app forwards the search term to the API unchanged." },
      {
        kind: "api",
        text: "The API builds the query by concatenation. The quote in the input closes the string, and OR '1'='1' matches every row.",
        sample: "SELECT * FROM products WHERE name LIKE '%' OR '1'='1%'",
      },
      { kind: "db", text: "The database runs the altered query with the application's privileges." },
    ],
    controls: [
      { control: "parameterized-queries", effect: "blocks", note: "The search term is sent as a value, so it is matched as text and the query's structure cannot change." },
      { control: "sast", effect: "blocks", note: "sentinel-sql-injection-raw-query flags the concatenated query in CI, so it is fixed before deployment. This only holds if the finding is acted on." },
      { control: "waf-rules", effect: "reduces", note: "This payload matches a common signature and is blocked. Encoded or restructured payloads can still get through." },
      { control: "least-privilege-db", effect: "reduces", note: "The injection still runs, but the role can only read the products table, so other tables stay out of reach." },
      { control: "runtime-monitoring", effect: "detects", note: "A spike in SQL errors and unusually large result sets raises an alert. The first requests still succeed." },
    ],
    related: { label: "Sentinel rule: SQL injection", href: `${SR}/01-sql-injection/README.md` },
  },
};
