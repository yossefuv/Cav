const {
    Command
} = require('discord-akairo');

class PrefixCommand extends Command {
    constructor() {
        super('prefix', {
            aliases: ['prefix'],
            category: 'general',
			description: { content: 'change the bot prefix' },
            args: [{
                id: 'prefix'
            }],
            userPermissions: ['MANAGE_GUILD'],
            channel: 'guild'
        });
    }

    async exec(message, args) {

        const prefix = message.guild.prefix;

        if (!args.prefix) return message.channel.send(`*The prefix is currently **\`${prefix}\`***\n*You can change it by doing **\`${prefix}prefix <prefix>\`***`);

        if (prefix === args.prefix) return message.channel.send('***Sorry**, that is already the prefix.*')

        message.guild.set(`prefix`, args.prefix);

        return message.channel.send(`*Successfully changed the prefix from **\`${prefix}\`** to **\`${args.prefix}\`***`);

    }
}

module.exports = PrefixCommand;