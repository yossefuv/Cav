import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
	cooldown: 5,
	category: "general",
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
	async execute(client: cClient, interaction: CommandInteraction) {
		await interaction.reply('Pong!');
	},
};
