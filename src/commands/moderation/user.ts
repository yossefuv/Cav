import { CommandInteraction, SlashCommandBuilder } from 'discord.js';

module.exports = {
	cooldown: 5,
	category: "moderation",
	data: new SlashCommandBuilder()
		.setName('useri')
		.setDescription('Provides information about the user.'),
	async execute(client: cClient, interaction: CommandInteraction) {
		// interaction.user is the object representing the User who ran the command
		// interaction.member is the GuildMember object, which represents the user in the specific guild
        //@ts-ignore
		await interaction.reply(`This command was run by ${interaction.user.username}, who joined on ${interaction.member.joinedAt}.`);
	},
};
