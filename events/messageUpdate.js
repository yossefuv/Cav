
const { messageTimeout } = require('../config');

 module.exports = async (client, oldMessage, newMessage) => {
 
    var settings = client.db.get(newMessage.guild.id);
    if(settings.enabled && settings.loggedChannels.includes(newMessage.channel.id) && newMessage.author !== client.user) {
     var active = await client.db.get('messageRecords');
     var channel = newMessage.guild.channels.cache.get(settings.channelToLog);

    if (active[newMessage.id]) {
       var message = newMessage.guild.channels.cache.get(settings.channelToLog).messages.cache.get(active[newMessage.id].loggedID);
       if (!message) return;

     let text = message.content.replace(oldMessage, '');
     //let regex = '(https?:\/\/[^\s]+)|(:pencil:)|[:]'
        text = text.replace(/https?:\/\/[^\s]+/gi, '');
        text = text.replace(':pencil:', '')

     message.edit(`${text.replace('\n','')}:pencil: ${newMessage.content} ${newMessage.attachments.size !== 0 ? `${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`)
    } else {
    channel.send(`${newMessage.channel} ${settings.messages.lastUser === `${newMessage.channel.id}.${newMessage.author.id}` ? '...' : `\`${newMessage.author.id}\` \`${newMessage.member.nickname ? newMessage.member.nickname:newMessage.author.username}\``} :pencil:: ${newMessage.content}${newMessage.attachments.size !== 0 ? `\n ${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`);
    }
    }  
 };

 