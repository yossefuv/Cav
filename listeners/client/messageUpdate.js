const {
   Listener
} = require('discord-akairo');

module.exports = class MessageUpdateListener extends Listener {
   constructor() {
       super('messageUpdate', {
           emitter: 'client',
           event: 'messageUpdate'
       });
   }

   async exec(oldMessage, newMessage) {
      if (newMessage.author.bot) return;

      var settings = this.client.db.get(newMessage.guild.id);
      if(settings.messages.enabled && settings.loggedChannels.includes(newMessage.channel.id) && newMessage.author !== this.client.user) {
       var active = await this.client.db.get('messageRecords');
       var channel = newMessage.guild.channels.cache.get(settings.channelToLog);
       if (!settings.loggedChannels.includes(newMessage.channel.id) && settings.channelToLog === newMessage.channel.id) return;

      if (active[newMessage.id]) {
         var message = newMessage.guild.channels.cache.get(settings.channelToLog).messages.cache.get(active[newMessage.id].loggedID);
         if (!message) return;
  
       let text = message.content.replace(await replaceMentions(oldMessage, oldMessage.content), '');
       //let regex = '(https?:\/\/[^\s]+)|(:pencil:)|[:]'
          text = text.replace(/https?:\/\/[^\s]+/gi, '');
          text = text.replace(':pencil:', '')
        let textTwoSend = await replaceMentions(newMessage, newMessage.content);

       message.edit(`${text.replace('\n','')}:pencil: ${textTwoSend} ${newMessage.attachments.size !== 0 ? `${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`)
      } else {
      let textTwoSend = await replaceMentions(newMessage, newMessage.content);
      channel.send(`${newMessage.channel} ${`\`${newMessage.author.id}\` \`${newMessage.member.nickname ? newMessage.member.nickname:newMessage.author.username}\``} :pencil:: ${textTwoSend}${newMessage.attachments.size !== 0 ? `${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
         newMessage.guild.updateLastUser(newMessage, 'none');
         var buffer = this.client.db.get(newMessage.guild.id,'messages.buffer')
         var length = await buffer.push(msg.id);

         if (length > this.client.global.bufferLimit) {
           var oldValue = await buffer.shift();
           var oldMsg = await channel.messages.cache.get(oldValue);
           if (!oldMsg) return;
           oldMsg.delete().catch(O_o => {});
         }
         this.client.db.set(newMessage.guild.id, buffer, 'messages.buffer')
      });
      }
      } 

   }
}


async function replaceMentions (message, text) {

   // removes @everyone, @here
   text = text.replace(/(@everyone+)|(@here+)/gi, `\`everyone\``);

   var mentions = message.mentions;

   // remove user metnions and replace them with 'NICKNAME ID'
   if (mentions.users.size !== 0) { 
   mentions.users.forEach(async (user) => {
       let nickname = message.guild.members.cache.get(user.id);
       nickname = nickname.nickname ? nickname.nickname : nickname.user.username;
       text = text.replace(/<\B@[!a-z0-9_-]+>/, `\`${nickname} ${user.id}\``);
       let regex = new RegExp(`(<@${user.id}+>)|(<@!${user.id}+>)`, 'g');
       text = text.replace(regex, `\`${nickname} ${user.id}\``);
   });
   }
   // removes role mention
   if (mentions.roles.size !== 0) { 
          mentions.roles.forEach(async (role) => {
       let regex = new RegExp(`(<@&${role.id}+>)`, 'g');
       text = text.replace(regex, `\`@ ${role.name}\``);
   });
  }
 return text;
 }