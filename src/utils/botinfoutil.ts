import { ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle, CommandInteraction, EmbedBuilder, MessageActionRowComponentBuilder, MessageComponentInteraction } from "discord.js";

   export async function bothelpu (client: cClient, interaction: CommandInteraction|ButtonInteraction|MessageComponentInteraction, onlyu: boolean = false) {
     
      const row = new ActionRowBuilder<MessageActionRowComponentBuilder>();
       row.addComponents(
         new ButtonBuilder()
           .setStyle(ButtonStyle.Link)
           .setURL("https://github.com/xYossaf/Cav")
           .setLabel("Github repo")
       );
       const embed = new EmbedBuilder()
       .setColor(`#6bde36`)
       .setAuthor({ name: `${client.user?.username}`,  iconURL: client.user?.avatarURL({ forceStatic: false })!
      })
       .setDescription(`Cav was made by xYossaf, a bot to log burh`)

      await interaction.reply({ embeds: [embed], components: [row],ephemeral: onlyu });

      }

