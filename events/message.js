const { prefix } = require('../config');
const { MessageEmbed } = require('discord.js');

module.exports = async (client, message) => {

    if (!message.guild) return;

    const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
    const newPrefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : prefix;
    LogMsg(client,message,prefix);
    const getPrefix = new RegExp(`^<@!?${client.user.id}>( |)$`);
    if (message.content.match(getPrefix)) return message.channel.send(`My prefix in this guild is \`${prefix}\``);

    if (message.author.bot) return;
    if (message.content.indexOf(newPrefix) !== 0) return;

    const args = message.content.slice(newPrefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command) || client.commands.get(client.aliases.get(command));
    if (!cmd) return;

    cmd.run(client, message, args);
};


function LogMsg(client,message,prefix) {
    var settings = client.db.get(message.guild.id);
    if(settings.enabled && settings.loggedChannels.includes(message.channel.id) && message.author !== client.user) {
       let Cmd =  message.content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();
       let vaildCmd = client.commands.get(Cmd) || client.commands.get(client.aliases.get(Cmd));
       if(vaildCmd && message.member.permissions.has("ADMINISTRATOR")) return;
    if(!settings.channelToLog) return;
    var channel = message.guild.channels.cache.get(settings.channelToLog);
    channel.send(`${message.channel} ${message.author} ${message.content}`);

}
}

// [Link](https://discordapp.com/channels/${message.guild.id}/${message.channel.id}/${message.id}) 
