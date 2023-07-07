import type {ButtonInteraction } from 'discord.js';
import {Events} from 'discord.js';
//import { helpro } from '../utils/helputil';

module.exports = {
	name: Events.InteractionCreate,
	async execute(client: cClient, interaction: ButtonInteraction) {
		if (!interaction.isButton()) return;
        try {
			
		} catch (error) {
			console.error(error);
		}
	},
};
