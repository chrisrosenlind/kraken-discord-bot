import 'dotenv/config';
import { KrakenClient } from './services/kraken/KrakenClient.js';
import { DiscordClient } from './bot/DiscordClient.js';

const main = async () => {
  const kraken = new KrakenClient({
    url: process.env.KRAKEN_WS_BASE_URL as string,
  });
  await kraken.waitUntilConnected();

  new DiscordClient({
    token: process.env.DISCORD_TOKEN as string,
    kraken,
  });
};

main();
