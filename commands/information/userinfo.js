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
            cooldown: 5250,
            args: [
				{
                    id: 'tuser',
                    type: 'member'
                },
                {
                    id: 'options',
                    type: 'lowercase'
                }            ],
            channel: 'guild'

        });
    }

    async exec(message, { tuser, options }) {
    if (!tuser) tuser = message.member;

    var msg = await message.channel.send(new MessageEmbed()
      .setAuthor(`Fetching data on ${tuser.user.tag}`, tuser.user.displayAvatarURL({ dynamic: true }))
      .setFooter(`${this.client.user.username}`, this.client.user.displayAvatarURL())
      .setColor(0x4dd0e1));

    var createdOn = tuser.user.createdAt.toDateString()
      , joinedOn = tuser.joinedAt.toDateString()
      , roles = tuser.roles.cache.array().slice(0,15).sort((a, b) => a.comparePositionTo(b)).reverse()
      , activeClients = Object.entries(tuser.presence.clientStatus || {}) 
      , postion = await getJoinPostion(message.guild, tuser.id);
    if (options === '--detailed') {


        var millisCreated = new Date().getTime() - tuser.user.createdAt.getTime();
        var daysCreated = millisCreated / 1000 / 60 / 60 / 24;
    
        var millisJoined = new Date().getTime() - tuser.joinedAt.getTime();
        var daysJoined = millisJoined / 1000 / 60 / 60 / 24;

        return msg.edit(new MessageEmbed()
        .setAuthor(`Detailed information on ${tuser.user.tag}`, tuser.user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(tuser.user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setFooter(`${this.client.user.username}`, this.client.user.displayAvatarURL())
        .setDescription([
            `${s} **ID**: \`${tuser.user.id}\``,
            `${s} **Created on**: \`${createdOn}\` **[${daysCreated.toFixed(0)} days]**`,
            `${s} **Joined on**: \`${joinedOn}\` **[${daysJoined.toFixed(0)} days]**`,
            `${s} **Join position**: \`${postion}\``,
            `${s} **Current status**: \`${tuser.presence.status.capitalize()}\``,
            `${tuser.presence.activities.length ? `**Current activities** ${s}\n${s} name: \`${tuser.presence.activities[0].state}\`\n${s} type: \`${tuser.presence.activities[0].name}\``: `${s} **Current activities**: \`None\``}`,
            `${activeClients.length ? `**Current active clients** ${s}\n${activeClients.map(([type, status]) => `${type} ${s} \`${status}\``).join('\n')}` :`${s} **Current active clients**: \`None\``}`,
        ])

        .addField('**Roles**', roles.join('  ').length >= 1024 ? "Roles are too large" : roles.join('  '))
        .setColor(roles[0].name !== '@everyone' ? roles[0].color == 0 ? roles[1].color == 0 ? 0x4dd0e1 : roles[1].color : roles[0].color : 0x4dd0e1));

    } else {
    return msg.edit(new MessageEmbed()
        .setAuthor(`${tuser.user.tag} | Displays information on ${tuser.user.username}`, tuser.user.displayAvatarURL({ dynamic: true }))
        .setThumbnail(tuser.user.displayAvatarURL({ dynamic: true, size: 2048 }))
        .setFooter(`${this.client.user.username} | Try and add the flag '--detailed' to see more info`, this.client.user.displayAvatarURL())
        .setDescription([
            `${s} **ID**: \`${tuser.user.id}\``,
            `${s} **Created on**: \`${createdOn}\``,
            `${s} **Joined on**: \`${joinedOn}\``,
            `${s} **Join position**: \`${postion}\``
        ])

        .addField('**Roles**', roles.join('  ').length >= 1024 ? "Roles are too large" : roles.join('  '))
        .setColor(roles[0].name !== '@everyone' ? roles[0].color == 0 ? roles[1].color == 0 ? 0x4dd0e1 : roles[1].color : roles[0].color : 0x4dd0e1));

    }
 }

}

function getJoinPostion(guild,ID) { 
    if (!guild.member(ID)) return; 

    let arr = guild.members.cache.array(); 
    arr.sort((a, b) => a.joinedAt - b.joinedAt); 

    for (let i = 0; i < arr.length; i++) { 
      if (arr[i].id == ID) return i;
    }
}

String.prototype.capitalize = function () { return this.replace(/^\w/, c => c.toUpperCase()); }

module.exports = UserinfoCommand;
