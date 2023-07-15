import type { Message, TextChannel } from 'discord.js';
import {Events} from 'discord.js';
import { dget, updateLastUser } from "../utils/db"
//import { helpro } from '../utils/helputil';

module.exports = {
	name: Events.MessageDelete,
	async execute(client: cClient, message: Message) {
        if (!message.guild || message.author.bot) return;
        var d = new Date().getTime();
        // Save guilds settings in variable settings
        var settings = await dget(client, message.guild);

      // Check if logging is enabled and if the message edited is in the list of logged channels (fail check if message was channel to log messages)
      if(settings.messages.enabled && settings.loggedChannels.includes(message.channel.id)  && settings.channelToLog !== message.channel.id) {
        //@ts-ignore
        var cguild = message.guild as cGuild;
        var active =  cguild.messageRecordsStatus ? cguild.messageRecords[message.id] ? cguild.messageRecords[message.id]: false: false;
        var channel = await message.guild.channels.cache.get(settings.channelToLog) as TextChannel;
        if (!channel) return;

        if (!active && (d - message.createdTimestamp < 2500)) {
            //@ts-ignore
            var x = await channel.messages.fetch({ limit: 1 });
          //  var y = await replaceMentions(message, message.content);
            var z = kmpSearch(message.content,x.first().content);
            var zz = kmpSearch(message.member.nickname ? message.member.nickname:message.author.username, x.first().content)
            if (z != -1 || zz != -1) {
               updateLastUser(client, cguild,message, 'none');
             return x.first().delete().catch(O_o => {});
            }
         }

         if (active) {

            // gets the message stored in the logging channel
            var messageb = cguild.channels.cache.get(settings.channelToLog) as TextChannel as any;
            messageb = messageb.messages.cache.get(active.loggedID);
            if (!messageb) return;
 
            // try to delete the message from logging channel
            messageb.delete().catch(O_o => {});
 
         } else {
          if (!settings.messages.deletedLog) return;
          // filter the message from mentions of users, roles and everyone and sends it 
          let textTwoSend = await replaceMentions(message, message.content);
 
         channel.send(`${message.channel} ${`\`${message.author.id}\` \`${message.member.nickname ? message.member.nickname:message.author.username}\`:x::`}  ${textTwoSend}${message.attachments.size !== 0 ? `${message.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
          
          // update the last user
          updateLastUser(client, cguild, message, 'none');
 
         // push to the buffer and remove old messages
          var buffer = await dget(client,cguild,'messages.buffer')
          var length = await buffer.push(msg.id);
 
          if (length > settings.messages.bufferLimit) {
            var oldValue = await buffer.shift();
            var oldMsg = await channel.messages.cache.get(oldValue);
            if (!oldMsg) return;
            oldMsg.delete().catch(O_o => {});
          }
          client.db.set(message.guild.id, buffer, 'messages.buffer')
 
         });
         }
       }
	},
};



 

async function replaceMentions (message: Message, text: string) {

    // removes @everyone, @here
    text = text.replace(/(@everyone+)|(@here+)/gi, `\`everyone\``);
 
    var mentions = message.mentions;
 
    // remove user metnions and replace them with 'NICKNAME ID'
    if (mentions.users.size !== 0) { 
    mentions.users.forEach(async (user) => {
        let nickname = message.guild.members.cache.get(user.id);

        let name = (nickname.nickname ? nickname.nickname : nickname.user.username);
        let regex = new RegExp(`(<@${user.id}+>)|(<@!${user.id}+>)`, 'g');
        text = text.replace(regex, `\`${name} ${user.id}\``);
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