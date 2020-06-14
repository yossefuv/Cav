
const { messageTimeout } = require('../config');

module.exports = async (client, message) => {

   var settings = client.db.get(message.guild.id);
   if(settings.enabled && settings.loggedChannels.includes(message.channel.id) && message.author !== client.user) {
    var active =  await client.db.get('messageRecords');
    var channel = message.guild.channels.cache.get(settings.channelToLog);

   if (active[message.id]) {
      var message = message.guild.channels.cache.get(settings.channelToLog).messages.cache.get(active[message.id].loggedID);
      if (!message) return;
     message.delete();
   } else {
   channel.send(`${message.channel} ${settings.messages.lastUser === `${message.channel.id}.${message.author.id}` ? '... :x:' : `\`${message.author.id}\` \`${message.member.nickname ? message.member.nickname:message.author.username}\`:x::`}  ${message.content}${message.attachments.size !== 0 ? `${message.attachments.map(a => a.url).join('\n')}`: ''}`);
   }
   }  
};
