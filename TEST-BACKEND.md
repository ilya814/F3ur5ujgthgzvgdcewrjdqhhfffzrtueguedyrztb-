# MineForge — online testbackend

This is a temporary API for testing the MineForge website. It does **not** host or start Minecraft.

## Deploy free with Render

1. Open https://dashboard.render.com/ and sign in or create a free account.
2. Choose **New + → Web Service**.
3. Connect GitHub if asked, then select `ilya814/F3ur5ujgthgzvgdcewrjdqhhfffzrtueguedyrztb-`.
4. Use these settings:
   - **Name:** `mineforge-test-api` (or another available name)
   - **Branch:** `main`
   - **Runtime/Language:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node test-backend.js`
   - **Instance type:** `Free`
5. Click **Create Web Service** and wait until Render reports **Live**.
6. Copy the public URL Render assigns, such as `https://your-service-name.onrender.com`. The exact name will be chosen by Render.

## Test it

Open these URLs, replacing the example host with your actual Render URL:

- `https://YOUR-RENDER-URL/health` — should return JSON with `"ok": true`.
- `https://YOUR-RENDER-URL/api/status` — confirms that the API is a demo.
- `https://YOUR-RENDER-URL/api/servers` — lists temporary demo server configurations.

The website is not connected to this API automatically yet; that is a separate next step.

## What this test backend can do

- Accept a demo server name, edition (Java/Bedrock), and software choice.
- Return the demo server list.
- Simulate start/stop by changing a status label.

## What it cannot do

- It does not install or launch Java, Paper, Fabric, Forge, or Bedrock server software.
- It does not reserve RAM/CPU, allocate ports, or give players a Minecraft address.
- It has no user accounts, passwords, team permissions, durable database, or production security.
- Demo data is kept only in memory and can disappear whenever the service restarts or sleeps.
- Anyone who can reach the API may be able to alter its temporary demo data. Do not put private information or secrets in it.

Render's free web services sleep after 15 minutes without traffic and can take around a minute to wake. Free services also have ephemeral storage, so this is for experiments only, not production hosting.
