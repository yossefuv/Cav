import type {ButtonInteraction } from 'discord.js';
import {Events} from 'discord.js';
//import { helpro } from '../utils/helputil';

module.exports = {
	name: Events.InteractionCreate,
	async execute(client: cClient, interaction: ButtonInteraction) {
		if (!interaction.isButton()) return;
		console.log("RAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA\n\n")
		//console.log(interaction)
       //  helpro(client,interaction,interaction.customId,true);
      // const command = client.commands.get(interaction.message.interaction.commandName);
        try {
         //  await helpro(client,interaction,interaction.customId,true);
		//	await command.execute(client, interaction, true, interaction.customId);
		} catch (error) {
			console.error(error);
		}
	},
};
