import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, MessageActionRowComponentBuilder, MessageComponentInteraction } from "discord.js";
import { bothelpu } from "./botinfoutil";
   export async function helpro (client: cClient, interaction: CommandInteraction|ButtonInteraction|MessageComponentInteraction, currentCategory: string = "general", replyInteraction: boolean = false) {
    if (currentCategory == "botInfo") return bothelpu(client,interaction,true);
        let commandsList: string = "";
        for (let key in client.commandCategories[currentCategory]) {
         let value = client.commandCategories[currentCategory][key];
         commandsList += `**/${value.name}** - ${value.description}\n`
        }
      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
      Object.keys(client.commandCategories).forEach(cmd => {
        row.addComponents(
           new ButtonBuilder()
             .setCustomId(cmd)
            .setLabel(capitalize(cmd))
             .setStyle(ButtonStyle.Primary)
            .setDisabled(cmd == currentCategory)
         );
      }); 
       row.addComponents(
         new ButtonBuilder()
           .setCustomId("botInfo")
           .setStyle(ButtonStyle.Secondary)
           .setLabel("Bot Info")
       );
       const embed = new EmbedBuilder()
       .setColor(`#6bde36`)
       .setAuthor({ name: `${client.user?.username}'s ${capitalize(currentCategory)} commands`,//  iconURL: client.user?.avatarURL({ forceStatic: false })!
      })
       .setDescription(`${commandsList}`)

      if (replyInteraction) {
      //@ts-ignore
       return interaction.update({ embeds: [embed], components: [row] })
      } else {
      await interaction.reply({ embeds: [embed], components: [row] });
      const collector = interaction.channel.createMessageComponentCollector({
        max: 7,
    });
    collector.on('collect', int => {
        if (int.customId != "botinfo") {
        helpro(client,int,int.customId,true); 
        } else {
            bothelpu(client,int,true);
        }
    })
}

      }

const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);