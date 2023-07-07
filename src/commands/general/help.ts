import { CommandInteraction, SlashCommandBuilder } from 'discord.js';
import { helpro } from '../../utils/helputil';

module.exports = {
  cooldown: 5,
	category: "general",
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('Replies with the help menu'),
	async execute(client: cClient ,interaction: CommandInteraction,replyInteraction: boolean = false, rcustomId: string = "general") {
        try { 
         helpro(client,interaction,rcustomId);
        }catch (error) {
          await interaction.reply({
            content: "Error: This server has 0 commands",
            ephemeral: true,
          });
          console.error(error);
        } 
      }
};
