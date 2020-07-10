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
                    if (phrase.length === 0 || isNaN(phrase)) return null;
                    const num = parseInt(phrase);
                    if (num < 1 || num > 500) return null;
                    return num;
                  },
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
        if (!number) return message.channel.send("Invaild number was given. type a number between 1-500");
        var i = number
        , j = 0
        , x = 0;
         do {
             if (i > 100) { x = 100 } else { x = i };
            await message.channel.bulkDelete(x).then((m) => {
                j += m.size
                i -= 100;
                if (i <= 10) message.channel.send(`Cleared \`${j}\` messages`);       
            }).catch(() => { message.channel.send(`Cannot delete any more messages: **messages older than 2 weeks cannot be deleted**. Deleted ${j} messages`); return i = 9;});
         }
         while (i > 10);
    }
}

module.exports = ClearCommand;