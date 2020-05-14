const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {
    message.channel.send(new MessageEmbed()
    .setAuthor(client.user.username, client.user.displayAvatarURL())
    .setDescription(`cLog was made by <@191615236363649025>`)

    )
};

exports.help = {
    name: 'info',
    aliases: [],
    description: 'gives you info.',
    usage: 'info'
};