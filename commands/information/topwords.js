const {
    Command
} = require('discord-akairo');

const {
     MessageEmbed
 } = require('discord.js');

class TopWordsCommand extends Command {
    constructor() {
        super('topwords', {
            aliases: ['topwords', 'topw', 'tw'],
            category: 'information',
			description: { content: 'view information about the server' },
            channel: 'guild'
        });
    }

    async exec(message) {
        const s = '[**»**](https://google.com/)';
        const { usedWords, count, wordLogging } = message.guild.get('messages');
        if (!wordLogging) return message.channel.send('Sorry but this feature is disabled here');

        const usedWordsSort = [];
        Object.entries(usedWords).map(([key, value]) => usedWordsSort.push([key, value]));
        usedWordsSort.sort(function (a, b) {
            return b[1] - a[1];
        });
       var number = usedWordsSort.length >= 20 ? 20 : usedWordsSort.length;
       
        message.channel.send(
            new MessageEmbed()
                .setAuthor(`Showing the top ${number} words used in ${message.guild.name}`, message.guild.iconURL())
                .setDescription(usedWordsSort.slice(0, number).map(w => `${s} **${w[0]}**: \`${w[1]} times\``))
        );
    }
}

module.exports = TopWordsCommand;