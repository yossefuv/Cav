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

class ClearCommand extends Command {
    constructor() {
        super('clear', {
            aliases: ['clear', 'purge', 'disappear', 'vanish'],
            category: 'moderation',
			description: { content: 'sends a message in another channel' },
            cooldown: 2000,
            args: [
                {
                   id: "number",
                   type: (message, phrase) => {
                    if (!phrase || isNaN(phrase)) return null;
                    const num = parseInt(phrase);
                    if (num < 1 || num > 100) return null;
                    return num;
                  },
                    prompt: {
                   retry: `Invaild number was given. type a number between 1-100`,
                   }

                }
            ],
        channel: 'guild'

        });
    }

    async userPermissions(message) {
        var { modRole } = await message.guild.get();
       if (!(message.member.roles.cache.get(modRole) || message.member.permissions.has('MANAGE_GUILD'))) return "Moderator";
    }

    async exec(message, { number }) {
        await message.channel.bulkDelete(number).then((m) => {
            message.channel.send(`Cleared \`${m.size}\` messages`)       
        });
    }
}

module.exports = ClearCommand;