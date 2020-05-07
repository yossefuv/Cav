const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {

    if (!message.member.permissions.has("ADMINISTRATOR")) return;
    if (!args[0]) return message.channel.send(new MessageEmbed().setDescription('Log: enable/disable logging and select the channel you want to log to').setColor(0x00b9ff));
    var settings = client.db.get(message.guild.id);
    if (args[0].toLowerCase() == "enable") {
        if (settings.enabled) return message.channel.send(new MessageEmbed().setDescription('Logging is already enabled').setColor(0xFF0000));
        await client.db.set(message.guild.id, true, 'enabled');
        return message.channel.send(new MessageEmbed().setDescription(`successfully enabled logging`).setColor(0x00b9ff));


    } else if (args[0].toLowerCase() == "disable") {
        if (!settings.enabled) return message.channel.send(new MessageEmbed().setDescription('Logging is already disabled').setColor(0xFF0000));
        await client.db.set(message.guild.id, false, 'enabled');
        return message.channel.send(new MessageEmbed().setDescription(`successfully disabled logging`).setColor(0x00b9ff));

        //
    } else if (args[0].toLowerCase() == "channel") {

        var exiChannel = message.guild.channels.cache.get(settings.channelToLog);
        if (!args[1]) {
            message.channel.send(new MessageEmbed()
                .setDescription(`The current logging channel is: **${exiChannel ? exiChannel : "None"}**`)
                .setFooter(`${client.user.username} | if you wish to change this do log channel <channel ID|Mention>`, client.user.displayAvatarURL())
                .setColor(0x00b9ff));
        }

        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if (!channel && args[1]) return message.channel.send(new MessageEmbed().setDescription('log [channel]: Invaild channel\n\n Usage channel add `<Channel ID|Mention>`').setColor(0xFF0000));

        if (exiChannel == channel.id) return message.channel.send(new MessageEmbed().setDescription('You cannot select the same channel').setColor(0xFF0000));
        await client.db.set(message.guild.id, channel.id, 'channelToLog');
        return message.channel.send(new MessageEmbed().setDescription(`${channel} is now the new log channel`).setColor(0x00b9ff));


    } else return message.channel.send(new MessageEmbed().setDescription('Log: enable/disable logging and select the channel you want to log to').setColor(0x00b9ff));


};

exports.help = {
    name: 'log',
    aliases: [],
    description: 'View the latency of the bot and API.',
    usage: 'log'
};