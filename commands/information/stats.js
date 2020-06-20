const {
    Command
} = require('discord-akairo');

const { MessageEmbed, version: discordVersion } = require('discord.js');
const moment = require('moment');
const { version } = require('../../package.json');
require('moment-duration-format');

class StatsCommand extends Command {
    constructor() {
        super('stats', {
            aliases: ['stats', 'status'],
            cooldown: 5000
        });
    }

    async exec(message) {
        const botUptime = moment.duration(this.client.uptime).format(' D [days], H [hrs], m [mins], s [secs]');
        const memUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const guildSize = this.client.guilds.cache.size.toLocaleString();
        const userSize = this.client.users.cache.size.toLocaleString();
    
        const statsEmbed = new MessageEmbed()
            .setAuthor(this.client.user.username, this.client.user.avatarURL)
            .setColor(0x4dd0e1)
            .addField('Guilds', guildSize, true)
            .addField('Users', userSize, true)
            .addField('Uptime', botUptime, true)
            .addField('Memory', `${Math.round(memUsage)} MB`, true)
            .addField('Discord.js', `v${discordVersion}`, true)
            .addField('Node', `${process.version}`, true)
            .setFooter(`Bot Version: ${version}`)
            .setTimestamp();
    
        message.channel.send(statsEmbed);
    }
}

module.exports = StatsCommand;