import { APIEmbedField, ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { version } from '../../cpackage.json'

module.exports = {
	cooldown: 5,
	category: "moderation",
	data: new SlashCommandBuilder()
		.setName('config')
		.setDescription('view&change of configuration of the bot in the server.')
        .addSubcommand(subcommnad => subcommnad.setName("view").setDescription("View the configuration of the bot in the server."))
        .addSubcommandGroup(subgroup => subgroup.setName("change").setDescription("Change the configuration of the bot in the server.")
          .addSubcommand(subcmd => subcmd.setName("limits").setDescription("limits changing"))
          .addSubcommand(subcmd => subcmd.setName("state").setDescription("state changing"))
          .addSubcommand(subcmd => subcmd.setName("channels").setDescription("channels changing"))
          .addSubcommand(subcmd => subcmd.setName("roles").setDescription("roles changing"))

        )
        ,

	async execute(client: cClient, interaction: ChatInputCommandInteraction) {
       const subCommand = interaction.options.getSubcommand();
       const subCommandGroup = interaction.options.getSubcommandGroup();
     
       if (subCommandGroup) {
         console.log(`User used subcommand group: ${subCommandGroup}, with command: ${subCommand}`);
       } else if (subCommand)  console.log(`User used subcommand: ${subCommand}`);
    

       if (subCommandGroup) {
        if (subCommandGroup == "change") {
            if (subCommand == "limits") {
                await EmbedSender(client,interaction," ",)
            }
        }

       }  else if (subCommand == "view") {
               await interaction.reply("LMAO get rkt");
            }
       
	},
};

async function EmbedSender (client: cClient, interaction: ChatInputCommandInteraction, description: string = " ", customfotter:string = "Config", feilds?: APIEmbedField) {
    const embed = new EmbedBuilder()
    .setAuthor({ name: client.user.username,  iconURL: client.user.avatarURL()})
    .setColor(0x4dd0e1)
    .setDescription(description)
   .setFooter({ text: `${customfotter} | Bot Version: ${version}`})
   .setTimestamp()

   if (feilds) {
    embed.addFields(feilds);
  }
  return await interaction.reply({embeds: [embed]});
}
