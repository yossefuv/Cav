const { MessageEmbed } = require('discord.js');

exports.run = async (client, message, args) => {

   message.channel.send(new MessageEmbed()
   .setDescription(`cLog is bot built by xYossaf#9915 for cracker`)
   .setColor());
  
};

exports.help = {
    name: 'info',
    aliases: [],
    description: 'info about this bot',
    usage: 'info'
};