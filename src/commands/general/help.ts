import { CommandInteraction, SlashCommandBuilder, EmbedBuilder, ApplicationCommand, MessageActionRowComponentBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with the help menu'),
	async execute(interaction: CommandInteraction) {
        try {
        let commandsList: string | undefined;
        console.log(interaction);
        console.log("=======================================\n\n\n\n")
        console.log(interaction.user);
        const client = interaction.client;
        const cmd = await client.application?.commands.fetch();
        commandsList = cmd
        ?.map(
          (cmd: ApplicationCommand) => `**/${cmd.name}** - ${cmd.description}`
        )
        .join("\n");
        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(
            new ButtonBuilder()
              .setCustomId("botInfo")
              .setEmoji("🤖")
              .setStyle(ButtonStyle.Primary)
              .setLabel("Bot Info"),
          );
    
          const embed = new EmbedBuilder()
            .setColor(`#6bde36`)
            .setTitle(`${client.user?.username}'s commands`)
            .setDescription(`${commandsList}`)
            .setThumbnail(client.user?.avatarURL({ forceStatic: false })!);
    
          await interaction.reply({ embeds: [embed], components: [row] });
        } catch (error) {
          await interaction.reply({
            content: "This server has 0 commands",
            ephemeral: true,
          });
          console.error(error);
        }}
};
