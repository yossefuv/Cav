const {
    Command
} = require('discord-akairo');

const {
     MessageEmbed
 } = require('discord.js');
 
 const {
      version,
       name
 } = require('../../package.json');

 var settings;

class ReplyCommand extends Command {
    constructor() {
        super('reply ', {
            aliases: ['reply', 'r'],
            category: 'moderation',
			description: { content: 'sends a message in another channel' },
            cooldown: 2000,
            args: [
                {
                   id: "channel",
                   type: "textChannel"
                },
				{
                    id: 'text',
                    match: 'rest',
                    type: 'string',
				},
            ],
            userPermissions: ['MANAGE_GUILD'],
            channel: 'guild'

        });
    }

    async exec(message, { channel, text }) {
       if (!channel | !text) return message.channel.send('Invaild input');
       channel.send(`\`${message.member.nickname ? message.member.nickname:message.author.username}\`: ${text}`);
    }
}

module.exports = ReplyCommand;