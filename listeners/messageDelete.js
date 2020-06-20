const {
   Listener
} = require('discord-akairo');

module.exports = class MessageDeleteistener extends Listener {
   constructor() {
       super('messageDelete', {
           emitter: 'client',
           event: 'messageDelete'
       });
   }

   async exec(message) {
      var settings = this.client.db.get(message.guild.id);
      if(settings.messages.enabled && settings.loggedChannels.includes(message.channel.id) && message.author !== this.client.user) {
         var active =  await this.client.db.get('messageRecords');
         var channel = message.guild.channels.cache.get(settings.channelToLog);
     
        if (active[message.id]) {
           var message = message.guild.channels.cache.get(settings.channelToLog).messages.cache.get(active[message.id].loggedID);
           if (!message) return;
          message.delete().delete().catch(O_o => {});
        } else {
        channel.send(`${message.channel} ${settings.messages.lastUser === `${message.channel.id}.${message.author.id}` ? '... :x:' : `\`${message.author.id}\` \`${message.member.nickname ? message.member.nickname:message.author.username}\`:x::`}  ${message.content}${message.attachments.size !== 0 ? `${message.attachments.map(a => a.url).join('\n')}`: ''}`);
        }
        }  

   }
}