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
      this.message = message;
     setTimeout(async () => {
      var settings = this.client.db.get(this.message.guild.id);
      if(settings.messages.enabled && settings.loggedChannels.includes(this.message.channel.id) && this.message.author !== this.client.user) {
         var active =  this.message.guild.messageRecords[this.message.id] ? this.message.guild.messageRecords[this.message.id]:false;
         var channel = await this.message.guild.channels.cache.get(settings.channelToLog);
         if (!channel) return;
         var x = await channel.messages.fetch({ limit: 1 });
         if (!active.loggedID) {
            var y = await replaceMentions(this.message, this.message.content)
            , z = x.first().content.includes(y);
            z === y ? active.loggedID = x.first().id:null 
            }
        if (active) {
           var message = this.message.guild.channels.cache.get(settings.channelToLog).messages.cache.get(active.loggedID);
           if (!message) return;
          message.delete().catch(O_o => {});
        } else {
         let textTwoSend = await replaceMentions(this.message, this.message.content);
        channel.send(`${this.message.channel} ${`\`${this.message.author.id}\` \`${this.message.member.nickname ? this.message.member.nickname:this.message.author.username}\`:x::`}  ${textTwoSend}${this.message.attachments.size !== 0 ? `${this.message.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
         this.message.guild.updateLastUser(this.message, 'none');
         var buffer = this.message.guild.get('messages.buffer')
         var length = await buffer.push(msg.id);

         if (length > this.client.global.bufferLimit) {
           var oldValue = await buffer.shift();
           var oldMsg = await channel.messages.cache.get(oldValue);
           if (!oldMsg) return;
           oldMsg.delete().catch(O_o => {});
         }
         this.client.db.set(this.message.guild.id, buffer, 'messages.buffer')

        })
        }
        }  
      }, 250)
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