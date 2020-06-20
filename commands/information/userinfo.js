const {
    Command
} = require('discord-akairo');

const {
     MessageEmbed
 } = require('discord.js');
 const s = '[**»**](https://google.com/)';

class UserinfoCommand extends Command {
    constructor() {
        super('userinfo', {
            aliases: ['userinfo', 'useri', 'whois', 'ui'],
            category: 'information',
			description: { content: 'view information about a user' },
            cooldown: 2000,
            args: [
				{
                    id: 'tuser',
                    type: 'member'
				},
            ],
            channel: 'guild'

        });
    }

    async exec(message, { tuser }) {
    if (!tuser) tuser = message.member;
    
    var createdOn = tuser.user.createdAt.toDateString()
      , joinedOn = tuser.joinedAt.toDateString()
      , roles = tuser.roles.cache.array().slice(0,15).sort((a, b) => a.comparePositionTo(b)).reverse();

    return message.channel.send(new MessageEmbed()
        .setAuthor(`${tuser.user.tag} | Displays information on ${tuser.user.username}`, tuser.user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(tuser.user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setFooter(`${this.client.user.username}`, this.client.user.displayAvatarURL())
        .setDescription([
            `${s} **ID**: \`${tuser.user.id}\``,
            `${s} **Created on**: \`${createdOn}\``,
            `${s} **JoinedOn**: \`${joinedOn}\``,
        ])

        .addField('**Roles**', roles.join('  ').length >= 1024 ? "Roles are too large" : roles.join('  '))
        .setColor(roles[0].color == 0 ? 0x4dd0e1 : roles[0].color));

    }
}

module.exports = UserinfoCommand;