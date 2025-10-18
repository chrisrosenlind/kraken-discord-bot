import {
  ChatInputCommandInteraction,
  Client,
  IntentsBitField,
  SlashCommandBuilder,
  REST,
  Routes,
  EmbedBuilder,
} from 'discord.js';
import type { KrakenClient } from 'src/services/kraken/KrakenClient.js';

type DiscordClientProps = {
  token: string;
  kraken: KrakenClient;
};

export class DiscordClient extends Client {
  private kraken: KrakenClient;

  constructor({ token, kraken }: DiscordClientProps) {
    super({
      intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
      ],
    });

    this.kraken = kraken;

    this.login(token);

    this.once('clientReady', () => {
      console.log(`Discord client ready: ${this.user?.tag}`);
      this.registerSlashCommands();
    });

    this.on('interactionCreate', async (interaction) => {
      if (!interaction.isChatInputCommand()) return;
      await this.handleCommand(interaction);
    });
  }

  private async registerSlashCommands() {
    const commands = [
      new SlashCommandBuilder()
        .setName('q')
        .setDescription('Get trading pair data')
        .addStringOption((option) =>
          option
            .setName('pair')
            .setDescription('Trading pair symbol, e.g., BTC/USD')
            .setRequired(true)
        )
        .toJSON(),
    ];

    const rest = new REST({ version: '10' }).setToken(
      process.env.DISCORD_TOKEN as string
    );

    try {
      await rest.put(Routes.applicationCommands(this.user?.id as string), {
        body: commands,
      });
      console.log('Registered slash commands');
    } catch (err) {
      console.error(`Failed to register slash commands: ${err}`);
    }
  }

  private async handleCommand(interaction: ChatInputCommandInteraction) {
    // Quote
    if (interaction.commandName === 'q') {
      const pair = interaction.options.getString('pair', true);
      try {
        const pairData = await this.kraken.addPairAndAwait(pair);
        const embed = new EmbedBuilder().setTitle(pairData.symbol).addFields([
          {
            name: 'Price Info',
            value: `
**Last:** ${pairData.last}  
**Bid / Ask:** ${pairData.bid} / ${pairData.ask}  
**24h Change:** ${pairData.change} (${pairData.change_pct}%)  
**24h High / Low:** ${pairData.high} / ${pairData.low}  
**Volume (24h):** ${pairData.volume}
      `,
            inline: false,
          },
        ]);

        await interaction.reply({ embeds: [embed] });
      } catch (err) {
        await interaction.reply(`Failed to fetch pair: ${err}`);
      }
    }
  }
}
