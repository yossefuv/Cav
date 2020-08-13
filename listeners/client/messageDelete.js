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
      // return if the user is a bot
      if (message.author.bot) return;
      var d = new Date().getTime();    

      // Save guilds settings in variable settings
      var settings = this.client.db.get(message.guild.id);

      // Check if logging is enabled and if the message edited is in the list of logged channels (fail check if message was channel to log messages)
      if(settings.messages.enabled && settings.loggedChannels.includes(message.channel.id)  && settings.channelToLog !== message.channel.id) {

         // gets the saved message object from the list otherwise return false | get the channel where messages are being logged at
         var active =  message.guild.messageRecordsStatus ? message.guild.messageRecords[message.id] ? message.guild.messageRecords[message.id]: false: false;
         var channel = await message.guild.channels.cache.get(settings.channelToLog);
         if (!channel) return;
          
         if (!active && (d - message.createdTimestamp < 2500)) {
            var x = await channel.messages.fetch({ limit: 1 });
            var y = await replaceMentions(message, message.content);
            var z = kmpSearch(message.content,x.first().content);
            var zz = kmpSearch(message.member.nickname ? message.member.nickname:message.author.username, x.first().content)
            if (z != -1 || zz != -1) {
               message.guild.updateLastUser(message, 'none');
             return x.first().delete().catch(O_o => {});
            }
         }

        if (active) {

           // gets the message stored in the logging channel
           var message = message.guild.channels.cache.get(settings.channelToLog).messages.cache.get(active.loggedID);
           if (!message) return;

           // try to delete the message from logging channel
            message.delete().catch(O_o => {});

        } else {

         // filter the message from mentions of users, roles and everyone and sends it 
         let textTwoSend = await replaceMentions(message, message.content);

        channel.send(`${message.channel} ${`\`${message.author.id}\` \`${message.member.nickname ? message.member.nickname:message.author.username}\`:x::`}  ${textTwoSend}${message.attachments.size !== 0 ? `${message.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
         
         // update the last user
         message.guild.updateLastUser(message, 'none');

        // push to the buffer and remove old messages
         var buffer = await message.guild.get('messages.buffer')
         var length = await buffer.push(msg.id);

         if (length > settings.messages.bufferLimit) {
           var oldValue = await buffer.shift();
           var oldMsg = await channel.messages.cache.get(oldValue);
           if (!oldMsg) return;
           oldMsg.delete().catch(O_o => {});
         }
         this.client.db.set(message.guild.id, buffer, 'messages.buffer')

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
 function kmpSearch(pattern, text) {
   if (pattern.length == 0)
     return 0; // Immediate match
 
   // Compute longest suffix-prefix table
   var lsp = [0]; // Base case
   for (var i = 1; i < pattern.length; i++) {
     var j = lsp[i - 1]; // Start by assuming we're extending the previous LSP
     while (j > 0 && pattern.charAt(i) != pattern.charAt(j))
       j = lsp[j - 1];
     if (pattern.charAt(i) == pattern.charAt(j))
       j++;
     lsp.push(j);
   }
 
   // Walk through text string
   var j = 0; // Number of chars matched in pattern
   for (var i = 0; i < text.length; i++) {
     while (j > 0 && text.charAt(i) != pattern.charAt(j))
       j = lsp[j - 1]; // Fall back in the pattern
     if (text.charAt(i) == pattern.charAt(j)) {
       j++; // Next char matched, increment position
       if (j == pattern.length)
         return i - (j - 1);
     }
   }
   return -1; // Not found
 }