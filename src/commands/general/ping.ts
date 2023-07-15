import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

module.exports = {
	cooldown: 5,
	category: "general",
	defaultMemberPermissions: PermissionFlagsBits.SendMessages,
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client: cClient, interaction: CommandInteraction) {
		await interaction.reply('Pong!');
	},
};
