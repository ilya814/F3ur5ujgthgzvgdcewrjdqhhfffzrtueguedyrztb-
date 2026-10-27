# MineForge — online testbackend

Deze testbackend is bedoeld om MineForge's website later met een online API te verbinden. Je hoeft niets op Windows te installeren.

## Deployen op Render (gratis test)

1. Open https://render.com en maak een account of meld je aan.
2. Kies **New + → Web Service**.
3. Verbind GitHub als Render daarom vraagt en kies de repository `ilya814/F3ur5ujgthgzvgdcewrjdqhhfffzrtueguedyrztb-`.
4. Stel in:
   - **Name:** `mineforge-test-api`
   - **Branch:** `main`
   - **Runtime/Language:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node test-api.js`
   - **Instance Type:** `Free`
5. Klik **Create Web Service** en wacht tot Render `Live` toont.
6. Open de Render-URL die eindigt op `.onrender.com`. Je hoort JSON te zien met `MineForge Hosting Test API`.
7. Open daarna `https://JOUW-RENDER-URL/health`. Je hoort `{"ok":true,...}` te zien.
8. Open `https://JOUW-RENDER-URL/api/servers` om de demoserverlijst te zien.

## Wat deze API wel doet
- Geeft een health-check terug.
- Bewaart tijdelijk demoserverrecords in het geheugen.
- Laat je een demo-record maken en de start/stop-status simuleren.

## Wat deze API niet doet
- Start of host geen Java- of Bedrock-Minecraft-server.
- Opent geen Minecraft-poorten en installeert geen Paper, Fabric, Forge, plugins of mods.
- Heeft nog geen login, gebruikersdatabase, teamrechten of echte privacybeveiliging.
- Is nog niet aangesloten op de MineForge-dashboardknoppen; daarvoor moet de frontend later het Render-adres gebruiken.

## Belangrijke gratis-planbeperkingen
Render Free-webservices kunnen na 15 minuten zonder verkeer slapen en bij een volgende aanvraag ongeveer een minuut nodig hebben om weer op te starten. Gegevens die alleen in het geheugen staan kunnen verdwijnen als de service herstart of slaapt. Dit is dus alleen voor een test, niet voor productiehosting.

**Veiligheid:** plaats geen wachtwoorden, API-sleutels of privégegevens in deze demo. Gebruik deze mock API niet om echte servers of betalende klanten te beheren.
