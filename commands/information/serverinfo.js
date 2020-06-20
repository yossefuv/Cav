const {
    Command
} = require('discord-akairo');

const {
     MessageEmbed
 } = require('discord.js');

class ServerinfoCommand extends Command {
    constructor() {
        super('serverinfo', {
            aliases: ['serverinfo', 'sinfo', 'si'],
            category: 'information',
			description: { content: 'view information about the server' },
            channel: 'guild'
        });
    }

    async exec(message) {
        const s = '[**»**](https://google.com/)';
        const { usedWords, count, wordLogging } = message.guild.get('messages');
        const usedWordsSort = [];
        Object.entries(usedWords).map(([key, value]) => usedWordsSort.push([key, value]));
        usedWordsSort.sort(function (a, b) {
            return b[1] - a[1];
        });
    
        message.channel.send(
            new MessageEmbed()
                .setAuthor(`Showing ${message.guild.name}'s information`, message.guild.iconURL())
                .setColor(0x4dd0e1)
                .setDescription(
                    [
                        `${s} Name: \`${message.guild.name}\``,
                        `${s} Owner: ${message.guild.owner}`,
                        `${s} Created at: \`${message.guild.createdAt.toDateString()}\``,
                        `${s} Users: \`${message.guild.members.cache.size}\``,
                        `${s} Channels: \`${message.guild.channels.cache.size}\``,
                        `${s} Roles: \`${message.guild.roles.cache.size}\``,
                        `${s} Recorded messages: \`${count}\``,
                        '',
                        `**Top words used** ${s}`,
                        `${ wordLogging ? 
                        `${usedWordsSort.length >= 3 ? [`${s} **${usedWordsSort[0][0]}**: \`${usedWordsSort[0][1]} times\``,
                        `${s} **${usedWordsSort[1][0]}**: \`${usedWordsSort[1][1]} times\``,
                        `${s} **${usedWordsSort[2][0]}**: \`${usedWordsSort[2][1]} times\``].join('\n'): 'Error: No messages were recorded :('}`: '\`Sorry but this feature is disabled here\`'}`
                    ].join('\n')
                )
                .setThumbnail(message.guild.iconURL({ size: 2048 }))
        );
    }
}

module.exports = ServerinfoCommand;