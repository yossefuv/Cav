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
      // Return if user is a bot | old message contents is same as new message
      if (newMessage.author.bot || oldMessage.content === newMessage.content) return;
 
      // Save guilds settings in variable settings
      var settings = await newMessage.guild.get();

      // Check if logging is enabled and if the message edited is in the list of logged channels (fail check if message was channel to log messages)
      if(settings.messages.enabled && settings.loggedChannels.includes(newMessage.channel.id) && settings.channelToLog !== newMessage.channel.id) {

         // gets the saved message object from the list otherwise return false | get the channel where messages are being logged at
        var isActive =  newMessage.guild.messageRecordsStatus ? newMessage.guild.messageRecords[newMessage.id] ? newMessage.guild.messageRecords[newMessage.id]: false: false;
        var channel = newMessage.guild.channels.cache.get(settings.channelToLog);
        if (!channel) return;

        if (isActive) {
         // gets the message stored in the logging channel
         var message = newMessage.guild.channels.cache.get(settings.channelToLog).messages.cache.get(isActive.loggedID);
         if (!message) return;

         // FirstPart is basically the channel and user name or ... in first part in the message, secondPart is just a filtered message from mentions of users, roles and everyone
        var FirstPart = await removeMessage(message,oldMessage);
        let secondPart = await replaceMentions(newMessage, newMessage.content);

       message.edit(`${FirstPart}:pencil: ${secondPart} ${newMessage.attachments.size !== 0 ? `${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`)
      } else {

      // filter the message from mentions of users, roles and everyone and sends it 
      var textTwoSend = await replaceMentions(newMessage, newMessage.content);
      channel.send(`${newMessage.channel} ${`\`${newMessage.author.id}\` \`${newMessage.member.nickname ? newMessage.member.nickname:newMessage.author.username}\``} :pencil:: ${textTwoSend}${newMessage.attachments.size !== 0 ? `${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
         
         // update last user
         newMessage.guild.updateLastUser(newMessage, 'none');

         // push to the buffer and remove old messages
         var buffer = this.client.db.get(newMessage.guild.id,'messages.buffer')
         var length = await buffer.push(msg.id);

         if (length > settings.messages.bufferLimit) {
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

 async function removeMessage(fullMessage, part) {

   let finalText = fullMessage.content.replace(await replaceMentions(part, part.content), '');
   finalText = finalText.replace(/https?:\/\/[^\s]+/gi, '');
   finalText = finalText.replace(':pencil:', '');
   finalText = finalText.replace('\n','');

  return finalText;
 }