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
      if (message.author.bot) return;

      var settings = this.client.db.get(message.guild.id);
      if(settings.messages.enabled && settings.loggedChannels.includes(message.channel.id) && message.author !== this.client.user) {
         var active =  await this.client.db.get('messageRecords');
         var channel = message.guild.channels.cache.get(settings.channelToLog);
     


        if (active[message.id]) {
           var message = message.guild.channels.cache.get(settings.channelToLog).messages.cache.get(active[message.id].loggedID);
           if (!message) return;
          message.delete().catch(O_o => {});
        } else {
         let textTwoSend = await replaceMentions(message, message.content);
        channel.send(`${message.channel} ${settings.messages.lastUser === `${message.channel.id}.${message.author.id}` ? '... :x:' : `\`${message.author.id}\` \`${message.member.nickname ? message.member.nickname:message.author.username}\`:x::`}  ${textTwoSend}${message.attachments.size !== 0 ? `${message.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
         var buffer = message.guild.get('messages.buffer')
         var length = await buffer.push(msg.id);
         var global = this.client.db.get('global');

         if (length > global.bufferLimit) {
           var oldValue = await buffer.shift();
           var oldMsg = await channel.messages.cache.get(oldValue);
           if (!oldMsg) return;
           oldMsg.delete().catch(O_o => {});
         }
         this.client.db.set(message.guild.id, buffer, 'messages.buffer')

        })
        }
        }  

   }
}

async function replaceMentions (message, text) {

   var mentions = message.mentions.users;
   if (mentions.size === 0) return text.replace(/(@everyone+)|(@here+)/gi, `\`everyone\``);
   mentions.forEach(async (user) => {
       let nickname = message.guild.members.cache.get(user.id);
       nickname = nickname.nickname ? nickname.nickname : nickname.user.username;
       text = text.replace(/<\B@[!a-z0-9_-]+>/, `\`${nickname} ${user.id}\``);
       let regex = new RegExp(`(<@${user.id}+>)|(<@!${user.id}+>)`, 'g');
       text = text.replace(regex, `\`${nickname} ${user.id}\``);
   });
   text = text.replace(/(@everyone+)|(@here+)/gi, `\`everyone\``)
 return text;
 }