const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    if (!message.member.permissions.has("ADMINISTRATOR")) return;
    if (!args[0]) return message.channel.send(new MessageEmbed().setDescription('Channel: adds or removes the channels you want to be logged \n\n**Usage:** channel `add|remove|view` `[channel ID|mention]`').setColor(0x00b9ff));
    var channelsSaved = client.db.get(message.guild.id).loggedChannels;
    if (args[0].toLowerCase() == "view") {


        if (!args[1]) return message.channel.send(new MessageEmbed().setDescription('Channel [view]: views a channel to the list to be loged\n\n Usage channel add `<Channel ID|Mention>`').setColor(0x00b9ff));
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if (!channel) return message.channel.send(new MessageEmbed().setDescription('Channel [vies]: Invaild channel\n\n Usage channel add `<Channel ID|Mention>`').setColor(0xFF0000));

    } else if (args[0].toLowerCase() == "add") {

        if (args[1] == "all") {
            var list = [];
            await message.guild.channels.cache.map((channel) => {
                list.push(channel.id);
            });

            await client.db.set(message.guild.id, list, 'loggedChannels');
            return message.channel.send(new MessageEmbed().setDescription(`added **${list.length}** channels to the list`).setColor(0x00b9ff));

        } else {
            if (!args[1]) return message.channel.send(new MessageEmbed().setDescription('Channel [add]: add a channel to the list to be loged\n\n Usage channel add `<Channel ID|Mention>`').setColor(0x00b9ff));
            let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
            if (!channel) return message.channel.send(new MessageEmbed().setDescription('Channel [add]: Invaild channel\n\n Usage channel add `<Channel ID|Mention>`').setColor(0xFF0000));
            if (channelsSaved.includes(channel.id)) return message.channel.send(new MessageEmbed().setDescription(`Channel [add]: ${channel} is already in the list`).setColor(0xFF0000));
            await client.db.push(message.guild.id, channel.id, 'loggedChannels');
            return message.channel.send(new MessageEmbed().setDescription(`added **${channel.name}** to the list`).setColor(0x00b9ff));
        }
    } else if (args[0].toLowerCase() == "remove") {

        if (!args[1]) return message.channel.send(new MessageEmbed().setDescription('Channel [remove]: remove a channel to the list to be loged\n\n Usage channel remove `<Channel ID|Mention>`').setColor(0x00b9ff));
        let channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]);
        if (!channel) return message.channel.send(new MessageEmbed().setDescription('Channel [remove]: Invaild channel\n\n Usage channel remove `<Channel ID|Mention>`').setColor(0xFF0000));
        if (!channelsSaved.includes(channel.id)) return message.channel.send(new MessageEmbed().setDescription(`Channel [remove]: ${channel} isn't in the list`).setColor(0xFF0000));
        let index = channelsSaved.indexOf(channel.id);
        if (index > -1) {
            channelsSaved.splice(index, 1);
        }
        await client.db.set(message.guild.id, channelsSaved, 'loggedChannels');
        return message.channel.send(new MessageEmbed().setDescription(`removed **${channel.name}** from the list`).setColor(0x00b9ff));

        //

    } else return message.channel.send(new MessageEmbed().setDescription('Channel: adds or removes the channels you want to be logged \n\n**Usage:** channel `add|remove|view` `[channel ID|mention]`').setColor(0x00b9ff));

};

exports.help = {
    name: 'channel',
    aliases: [],
    description: 'replys with text given to a channel.',
    usage: 'channel'
};