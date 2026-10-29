// MineForge Hosting — test API.
// Demo only: it stores server configurations but does NOT start Minecraft servers.
const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 10000;
const allowedOrigins = new Set([
  "https://ilya814.github.io",
  "http://localhost:3030",
  "http://127.0.0.1:3030"
]);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && allowedOrigins.has(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: "10kb" }));

// Set both values in Render Environment to enable database persistence.
// Never put the Supabase secret key in the website's HTML or share it publicly.
const SUPABASE_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY || "";
const databaseEnabled = Boolean(SUPABASE_URL && SUPABASE_SECRET_KEY);
const memoryServers = [];
const MAX_SERVERS = 20;

async function dbRequest(path, options = {}) {
  const response = await fetch(SUPABASE_URL + "/rest/v1/" + path, {
    ...options,
    headers: {
      apikey: SUPABASE_SECRET_KEY,
      Authorization: "Bearer " + SUPABASE_SECRET_KEY,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });
  const body = await response.text();
  if (!response.ok) throw new Error("Database request failed (HTTP " + response.status + "): " + body.slice(0, 300));
  return body ? JSON.parse(body) : null;
}
function safeError(res, error) {
  console.error(error);
  return res.status(503).json({
    error: databaseEnabled
      ? "Database tijdelijk niet beschikbaar. Controleer de Supabase-instellingen in Render."
      : "Database is nog niet ingesteld. De tijdelijke demo-modus is actief."
  });
}
function publicServer(row) {
  return {
    id: row.id, name: row.name, edition: row.edition,
    software: row.software, status: row.status,
    demo: true, createdAt: row.created_at || row.createdAt
  };
}
async function getServers() {
  if (databaseEnabled) {
    const rows = await dbRequest("mineforge_servers?select=*&order=created_at.desc");
    return rows.map(publicServer);
  }
  return memoryServers;
}
async function addServer(server) {
  if (databaseEnabled) {
    const rows = await dbRequest("mineforge_servers", {
      method: "POST",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({
        id: server.id, name: server.name, edition: server.edition,
        software: server.software, status: server.status, created_at: server.createdAt
      })
    });
    return publicServer(rows[0]);
  }
  memoryServers.push(server);
  return server;
}
async function updateServer(id, status) {
  if (databaseEnabled) {
    const rows = await dbRequest("mineforge_servers?id=eq." + encodeURIComponent(id) + "&select=*", {
      method: "PATCH",
      headers: { Prefer: "return=representation" },
      body: JSON.stringify({ status })
    });
    return rows.length ? publicServer(rows[0]) : null;
  }
  const server = memoryServers.find(item => item.id === id);
  if (!server) return null;
  server.status = status;
  return server;
}

app.get("/", (req, res) => res.json({
  name: "MineForge Test Backend",
  mode: databaseEnabled ? "demo-persistent-database" : "demo-memory",
  realMinecraftHosting: false,
  databaseEnabled,
  message: "Server controls are simulated. No Minecraft process is launched."
}));
app.get("/health", (req, res) => res.json({
  ok: true, service: "mineforge-test-backend",
  mode: databaseEnabled ? "demo-persistent-database" : "demo-memory",
  databaseEnabled
}));
app.get("/api/status", (req, res) => res.json({
  online: true,
  mode: databaseEnabled ? "demo-persistent-database" : "demo-memory",
  databaseEnabled,
  realMinecraftHosting: false,
  note: "API online; Minecraft servers are not running here."
}));

app.get("/api/servers", async (req, res) => {
  try {
    res.json({ mode: databaseEnabled ? "demo-persistent-database" : "demo-memory", servers: await getServers() });
  } catch (error) { safeError(res, error); }
});

app.post("/api/servers", async (req, res) => {
  const name = String(req.body?.name || "").trim().slice(0, 40);
  const edition = String(req.body?.edition || "Java").trim();
  const software = String(req.body?.software || "Paper").trim();
  if (!name) return res.status(400).json({ error: "Vul een servernaam in." });
  if (!["Java", "Bedrock"].includes(edition)) return res.status(400).json({ error: "Edition moet Java of Bedrock zijn." });
  if (!["Vanilla", "Paper", "Fabric", "Forge", "Bedrock"].includes(software)) return res.status(400).json({ error: "Onbekende demo-software." });

  try {
    const current = await getServers();
    if (current.length >= MAX_SERVERS) return res.status(429).json({ error: "Demo-limiet bereikt." });
    const server = {
      id: crypto.randomUUID(), name, edition, software,
      status: "stopped", demo: true, createdAt: new Date().toISOString()
    };
    const saved = await addServer(server);
    res.status(201).json({
      message: databaseEnabled
        ? "Demo-configuratie opgeslagen in de online database; er is geen Minecraft-server gestart."
        : "Demo-configuratie tijdelijk aangemaakt; er is geen Minecraft-server gestart.",
      server: saved
    });
  } catch (error) { safeError(res, error); }
});

app.post("/api/servers/:id/:action", async (req, res) => {
  if (!["start", "stop"].includes(req.params.action)) return res.status(400).json({ error: "Gebruik start of stop." });
  try {
    const status = req.params.action === "start" ? "running (simulated)" : "stopped";
    const server = await updateServer(req.params.id, status);
    if (!server) return res.status(404).json({ error: "Demo-server niet gevonden." });
    res.json({
      message: req.params.action === "start"
        ? "Demo gestart: alleen de status is veranderd. Er draait geen Minecraft-proces."
        : "Demo gestopt: alleen de status is veranderd.",
      server
    });
  } catch (error) { safeError(res, error); }
});

app.listen(PORT, "0.0.0.0", () => {
  console.log("MineForge test API listening on port " + PORT + (databaseEnabled ? " (database configured)" : " (temporary memory mode)"));
});
