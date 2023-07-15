import { CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';
import { dget } from '../../utils/db';

module.exports = {
	cooldown: 5,
	category: "information",
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
	data: new SlashCommandBuilder()
		.setName('topwords')
		.setDescription('Provides information about the saved topwords.')
        .setDMPermission(false)
       ,
	async execute(client: cClient, interaction: CommandInteraction) {
        const s = '[**»**](https://google.com/)';
        const { usedWords, wordLogging } = await dget(client, interaction.guild, 'messages');
        if (!wordLogging) return interaction.reply({content: 'Sorry but this feature is disabled here'});
        const usedWordsSort = [];
        Object.entries(usedWords).map(([key, value]) => usedWordsSort.push([key, value]));
        usedWordsSort.sort(function (a, b) {
            return b[1] - a[1];
        });
        console.log(usedWords)
        console.log(usedWordsSort)
         var number = usedWordsSort.length >= 20 ? 20 : usedWordsSort.length;
         var tosendText = usedWordsSort.slice(0, number).map(w => `${s} **${w[0]}**: \`${w[1]} times\``).join('\n');
        const embed = new EmbedBuilder()
        .setAuthor({ name: `Showing the top ${number} words used in ${interaction.guild.name}`,  iconURL: interaction.guild.iconURL({ forceStatic: false })})
        .setDescription(tosendText.length > 1 ? tosendText:`Not enough activity`);
        await interaction.reply({embeds: [embed]});

    },
};
