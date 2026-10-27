// MineForge Hosting — temporary online test API.
// IMPORTANT: This is a demo only. It does NOT start Minecraft servers.
const express = require("express");

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

// In-memory demo data: resets whenever this service restarts or sleeps.
const servers = [];
const MAX_SERVERS = 20;

app.get("/", (req, res) => {
  res.json({
    name: "MineForge Test Backend",
    mode: "demo",
    realMinecraftHosting: false,
    message: "This API simulates server settings and controls only. No Minecraft process is launched."
  });
});

app.get("/health", (req, res) => {
  res.json({ ok: true, service: "mineforge-test-backend", mode: "demo" });
});

app.get("/api/status", (req, res) => {
  res.json({
    online: true,
    mode: "demo",
    realMinecraftHosting: false,
    note: "API online; Minecraft servers are not running here."
  });
});

app.get("/api/servers", (req, res) => {
  res.json({ mode: "demo", servers });
});

app.post("/api/servers", (req, res) => {
  const name = String(req.body?.name || "").trim().slice(0, 40);
  const edition = String(req.body?.edition || "Java").trim();
  const software = String(req.body?.software || "Paper").trim();

  if (!name) return res.status(400).json({ error: "Vul een servernaam in." });
  if (!["Java", "Bedrock"].includes(edition)) {
    return res.status(400).json({ error: "Edition moet Java of Bedrock zijn." });
  }
  if (!["Vanilla", "Paper", "Fabric", "Forge", "Bedrock"].includes(software)) {
    return res.status(400).json({ error: "Onbekende demo-software." });
  }
  if (servers.length >= MAX_SERVERS) {
    return res.status(429).json({ error: "Demo-limiet bereikt. De lijst is tijdelijk." });
  }

  const server = {
    id: String(Date.now()) + "-" + Math.random().toString(36).slice(2, 8),
    name,
    edition,
    software,
    status: "stopped",
    demo: true,
    createdAt: new Date().toISOString()
  };
  servers.push(server);
  res.status(201).json({
    message: "Demo-serverconfig aangemaakt; er is geen Minecraft-server gestart.",
    server
  });
});

app.post("/api/servers/:id/:action", (req, res) => {
  const server = servers.find(item => item.id === req.params.id);
  if (!server) return res.status(404).json({ error: "Demo-server niet gevonden." });
  if (!["start", "stop"].includes(req.params.action)) {
    return res.status(400).json({ error: "Gebruik start of stop." });
  }

  // Deliberately changes only the displayed demo state.
  server.status = req.params.action === "start" ? "running (simulated)" : "stopped";
  res.json({
    message: req.params.action === "start"
      ? "Demo gestart: alleen de status is veranderd. Er draait geen Minecraft-proces."
      : "Demo gestopt: alleen de status is veranderd.",
    server
  });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MineForge test API listening on port ${PORT}`);
});
