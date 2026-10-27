MineForge Hosting — starter
Deze versie bevat een eigen dashboard én een lokale backend die een echte Paper Java-server kan starten/stoppen en directe plugin-JAR-downloads naar de plugins-map kan plaatsen.
1. Installeer op Windows
Node.js LTS: https://nodejs.org/
Java 21: https://adoptium.net/
Pak deze ZIP uit, bijvoorbeeld in `C:\MineForge`.
Open de uitgepakte map, klik op de adresbalk van Verkenner, typ `cmd` en druk Enter.
Voer uit: `npm install`
2. Download Paper
Download een passende Paper-server via https://papermc.io/downloads/paper
Hernoem het bestand naar `paper.jar`.
Plaats het in de map `minecraft-server` in deze projectmap.
Voer in de terminal uit: `java -Xms1G -Xmx2G -jar minecraft-server\paper.jar nogui`
Lees de EULA op https://www.minecraft.net/eula. Alleen als je akkoord gaat, wijzig je `eula=false` naar `eula=true` in `minecraft-server/eula.txt`.
Start de Paper-opdracht opnieuw en typ `stop` zodra de server volledig gestart is.
3. Start MineForge
Voer in de projectmap uit: `npm start`
Open http://127.0.0.1:3030. Laat het terminalvenster open.
Belangrijke beperkingen
Dit draait lokaal op je eigen Windows-computer. Het is nog geen publieke hostingdienst en spelers van buiten je netwerk kunnen niet automatisch verbinden.
GitHub Pages kan alleen de website hosten, niet de serverprocessen. Later is een echte Linux-host/backend nodig om MineForge als publieke hostingdienst te maken.
De zichtbaarheid `public/private/team` wordt als metadata opgeslagen. Er zijn nog geen accounts of toegangsrechten; het is dus nog geen echte privacybeveiliging.
Alleen directe HTTPS-links van Modrinth, CurseForge, GitHub of PaperMC worden geaccepteerd. Een projectpagina is meestal geen directe downloadlink.
Alleen plugininstallatie voor Paper is nu actief. Mods vereisen Fabric/Forge en moeten op server- en clientvereisten worden gecontroleerd. Vanilla-clients kunnen plugins en server-side mods gebruiken, maar niet zomaar mods die ook aan de clientkant nodig zijn.
Installeer alleen software van makers die je vertrouwt. Plugins/mods zijn uitvoerbare code.
Bedrock-crossplay via Geyser/Floodgate, gebruikersaccounts, backups en veilige publieke serverisolatie zijn vervolgstappen.
