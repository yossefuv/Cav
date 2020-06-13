exports.run = async (client, message, args) => {
    if(!message.member.permissions.has("ADMINISTRATOR")) return;
    var channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);
    if(!channel) return message.channel.send("Invaild channel.");
    var msg = args.splice(1).join(' ');
    channel.send(`\`${message.member.nickname ? message.member.nickname:message.author.username}\`: ${msg}`);
};

exports.help = {
    name: 'reply',
    aliases: [],
    description: 'replys with text given to a channel.',
    usage: 'reply'
};