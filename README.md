# Kraken discord bot

## About

This is a free Discord bot that fetches trading pairs from Kraken.

## Installation

This project assumes you have a `.env` in root. Example:

```env
KRAKEN_WS_BASE_URL=wss://ws.kraken.com/v2
DISCORD_TOKEN= # Your bots token
DISCORD_BASE_URL=https://discord.com/api/v10
```

```bash
npm i
npm run start
```

You will have to create a bot on your own. To do so, go here: https://discord.com/developers/applications.

When start script runs, it will automatically register all the slash commands. To see the commands or add your own, see [DiscordClient](./src/bot/DiscordClient.ts).
