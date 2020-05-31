

 module.exports = async (client, oldMessage, newMessage) => {
 
    var settings = client.db.get(newMessage.guild.id);
    if(settings.enabled && settings.loggedChannels.includes(newMessage.channel.id) && newMessage.author !== client.user) {

    var channel = newMessage.guild.channels.cache.get(settings.channelToLog);
    channel.send(`${newMessage.channel} ${newMessage.author} ${newMessage.content}`);

    }  
 };