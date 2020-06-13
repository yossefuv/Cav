const { MessageEmbed } = require('discord.js');
const s = '[**»**](https://google.com/)';
var settings;

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return;
    return message.channel.send(`This command has been disabled as it's useless`)
/*
   settings = client.db.get(message.guild.id);
   if(!args[0]) return message.channel.send(new MessageEmbed()
   .setTitle(`Server preferences for ${message.guild.name}`)
   .setDescription([
       '',
       `Don't know what a key does? do preferences help \`<key>\` to learn more about it`,
       '',
       `${s} **Current Server preferences** ${s}`,
       `${s} Mention: \`${settings.preferences.mention ? 'Yes':'No'}\``,
       '',
       `${s} **Usage** ${s}`,
       `${s} preferences Mention \`<enable/disable>\``,
   ].join('\n'))
   .setColor(0x00b9ff)
   )

   if (args[0].toLowerCase() === 'mention') {
       if (!args[1]) return message.channel.send(new MessageEmbed().setDescription('**Usage:** preferences mention <enable|disable>').setColor(0x00b9ff));
       if (args[1].toLowerCase() === 'enable') {
       if (settings.preferences.mention) return message.channel.send(new MessageEmbed().setDescription('Mention is already enabled').setColor(0xFF0000));
       await client.db.set(message.guild.id, true, 'preferences.mention');
       return message.channel.send(new MessageEmbed().setDescription(`successfully enabled mention`).setColor(0x00b9ff));

       } else if (args[1].toLowerCase() === 'disable') {
        if (!settings.preferences.mention) return message.channel.send(new MessageEmbed().setDescription('Mention is already disabled').setColor(0xFF0000));
        await client.db.set(message.guild.id, false, 'preferences.mention');
        return message.channel.send(new MessageEmbed().setDescription(`successfully disabled mention`).setColor(0x00b9ff));
 
    } 
   }

*/
};

exports.help = {
	name: 'preferences',
	aliases: [],
	description: 'shows the guilds information',
	usage: 'preferences',
};
