import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

module.exports = {
	cooldown: 5,
	category: "information",
	data: new SlashCommandBuilder()
		.setName('serverinfo')
		.setDescription('Provides information about the server.')
        .setDMPermission(false),
	async execute(client: cClient, interaction: CommandInteraction) {
        const s = '[**»**](https://google.com/)';
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Showing ${interaction.guild.name}'s information`,  iconURL: interaction.guild.iconURL({ forceStatic: false })})
        .setColor(0x4dd0e1)
        .setDescription(
            [
                `${s} Name: \`${interaction.guild.name}\``,
                `${s} Owner: <@${interaction.guild.ownerId}>`,
                `${s} Created at: \`${interaction.guild.createdAt.toDateString()}\``,
                `${s} Users: \`${interaction.guild.members.cache.size}\``,
                `${s} Channels: \`${interaction.guild.channels.cache.size}\``,
                `${s} Roles: \`${interaction.guild.roles.cache.size}\``,
              
            ].join('\n')
        )

		await interaction.reply({embeds: [embed]});
	},
};
