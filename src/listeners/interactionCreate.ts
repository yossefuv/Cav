import type {ChatInputCommandInteraction } from 'discord.js';
import {Collection,Events} from 'discord.js';

module.exports = {
	name: Events.InteractionCreate,
	async execute(client: cClient, interaction: ChatInputCommandInteraction) {
		if (!interaction.isChatInputCommand()) return;
		//console.log("RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n\n")
		//console.log(interaction)
	 	const command = client.commands.get(interaction.commandName);
		if (interaction.isCommand()) {
		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (!client.cooldowns.has(command.data.name)) {
			client.cooldowns.set(command.data.name, new Collection());
		}
		
		const now = Date.now();
		const timestamps = client.cooldowns.get(command.data.name);
		const defaultCooldownDuration = 3;
		const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
		
		if (timestamps.has(interaction.user.id)) {
		const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

	if (now < expirationTime) {
		const expiredTimestamp = Math.round(expirationTime / 1000);
		return interaction.reply({ content: `Please wait, you are on a cooldown for \`${command.data.name}\`. You can use it again <t:${expiredTimestamp}:R>.`, ephemeral: true });
		}
	}

	timestamps.set(interaction.user.id, now);
	setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);
		try {
			await command.execute(client, interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	}
	},
};

