import { CommandInteraction, EmbedBuilder, SlashCommandBuilder, version as discordVersion } from 'discord.js';
const moment = require('moment');
import { version } from '../../cpackage.json'
require('moment-duration-format');

module.exports = {
	cooldown: 5,
	category: "information",
	data: new SlashCommandBuilder()
		.setName('stats')
		.setDescription('Provides information about the bot.')
       ,
	async execute(client: cClient, interaction: CommandInteraction) {
        const botUptime = moment.duration(client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const memUsage = Number((process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2));
        const guildSize = client.guilds.cache.size.toLocaleString();
        const userSize = client.users.cache.size.toLocaleString();
        const embed = new EmbedBuilder()
        .setAuthor({ name: client.user.username,  iconURL: client.user.avatarURL()})
        .setColor(0x4dd0e1)
       .addFields(
        {name: 'Guilds', value: guildSize, inline: true},
        {name: 'Users', value: userSize, inline: true},
        {name: 'Uptime', value: botUptime, inline: true},
        {name: 'Memory', value: `${Math.round(memUsage)} MB`, inline: true},
        {name: 'Discord.js', value: discordVersion, inline: true},
        {name: 'Node', value: `${process.version}`, inline: true})
       .setFooter({ text: `Bot Version: ${version}`})
       .setTimestamp()

      await interaction.reply({embeds: [embed]});
	},
};

