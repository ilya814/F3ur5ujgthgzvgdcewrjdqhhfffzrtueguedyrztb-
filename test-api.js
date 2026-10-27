const express = require("express");
const crypto = require("crypto");

const app = express();
const PORT = process.env.PORT || 10000;

// This is deliberately a MOCK API. It never launches Java or Minecraft.
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
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});
app.use(express.json({ limit: "10kb" }));

const servers = [
  {
    id: "demo-survival",
    name: "Demo Survival",
    edition: "Java",
    software: "Paper (demo)",
    status: "stopped",
    note: "Demogegevens — geen Minecraft-server gestart."
  }
];

app.get("/", (_req, res) => {
  res.json({
    name: "MineForge Hosting Test API",
    mode: "mock",
    message: "Online testbackend werkt. Dit start geen echte Minecraft-servers.",
    endpoints: ["/health", "/api/servers"]
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "mineforge-test-api", mode: "mock" });
});

app.get("/api/servers", (_req, res) => {
  res.json({ mode: "mock", servers });
});

app.post("/api/servers", (req, res) => {
  const name = String(req.body?.name || "").trim().slice(0, 40);
  const edition = String(req.body?.edition || "Java");
  if (!name) return res.status(400).json({ error: "Vul een servernaam in." });
  if (!["Java", "Bedrock"].includes(edition)) {
    return res.status(400).json({ error: "Kies Java of Bedrock." });
  }

  const server = {
    id: crypto.randomUUID(),
    name,
    edition,
    software: "Nog niet ingesteld (demo)",
    status: "stopped",
    note: "Alleen een testrecord; er draait geen Minecraft-server."
  };
  servers.push(server);
  res.status(201).json({ mode: "mock", server });
});

app.post("/api/servers/:id/:action", (req, res) => {
  const action = req.params.action;
  if (!["start", "stop"].includes(action)) {
    return res.status(404).json({ error: "Onbekende actie. Gebruik start of stop." });
  }
  const server = servers.find((item) => item.id === req.params.id);
  if (!server) return res.status(404).json({ error: "Testserver niet gevonden." });

  // Simulate the button only: no process, port, files or game server is created.
  server.status = action === "start" ? "running-demo" : "stopped";
  server.note = action === "start"
    ? "De knop is getest; er draait GEEN echte Minecraft-server."
    : "Demo-status gestopt; er was geen echte Minecraft-server actief.";
  res.json({ mode: "mock", server, message: action === "start"
    ? "Demo gestart (alleen status nagebootst)."
    : "Demo gestopt (alleen status nagebootst)." });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`MineForge Test API listening on port ${PORT}`);
});
