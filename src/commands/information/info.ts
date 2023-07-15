import { CommandInteraction, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { bothelpu } from '../../utils/botinfoutil';

module.exports = {
	cooldown: 5,
	category: "information",
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
	data: new SlashCommandBuilder()
		.setName('info')
		.setDescription('Provides information about the bot.')
        .setDMPermission(false),
	async execute(client: cClient, interaction: CommandInteraction) {
        await bothelpu(client, interaction);
    },
};
