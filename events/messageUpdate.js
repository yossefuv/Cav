

 module.exports = async (client, oldMessage, newMessage) => {
 
    var settings = client.db.get(newMessage.guild.id);
    if(settings.enabled && settings.loggedChannels.includes(newMessage.channel.id) && newMessage.author !== client.user) {

    var channel = newMessage.guild.channels.cache.get(settings.channelToLog);
    channel.send(`${newMessage.channel} ${settings.messages.lastUser === `${newMessage.channel.id}.${newMessage.author.id}` ? '\`...\`:' : `\`${newMessage.author.id}\` \`${newMessage.member.nickname ? newMessage.member.nickname:newMessage.author.username}\`:`} ${newMessage.content}${newMessage.attachments.size !== 0 ? `\n ${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`);

    }  
 };