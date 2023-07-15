import type { Message, TextChannel } from 'discord.js';
import {Events} from 'discord.js';
import { dget, updateLastUser } from "../utils/db"
//import { helpro } from '../utils/helputil';

module.exports = {
	name: Events.MessageUpdate,
	async execute(client: cClient, oldMessage: Message, newMessage: Message) {
        if (!newMessage.guild || newMessage.author.bot || newMessage.content == oldMessage.content) return;

        // Save guilds settings in variable settings
        var settings = await dget(client, newMessage.guild);
        var cguild = newMessage.guild as cGuild;

         // Check if logging is enabled and if the message edited is in the list of logged channels (fail check if message was channel to log messages)
      if(settings.messages.enabled && settings.loggedChannels.includes(newMessage.channel.id) && settings.channelToLog !== newMessage.channel.id) {

        // gets the saved message object from the list otherwise return false | get the channel where messages are being logged at
       var isActive =  cguild.messageRecordsStatus ? cguild.messageRecords[newMessage.id] ? cguild.messageRecords[newMessage.id]: false: false;
       var channel = newMessage.guild.channels.cache.get(settings.channelToLog) as TextChannel;
       if (!channel) return;

       if (isActive) {
        // gets the message stored in the logging channel
        var messagen = newMessage.guild.channels.cache.get(settings.channelToLog) as TextChannel|any;
        messagen = messagen.messages.cache.get(isActive.loggedID);
        if (!messagen) return;

        // FirstPart is basically the channel and user name or ... in first part in the message, secondPart is just a filtered message from mentions of users, roles and everyone
       var FirstPart = await removeMessage(messagen,oldMessage);
       let secondPart = await replaceMentions(newMessage, newMessage.content);

       messagen.edit(`${FirstPart}:pencil: ${secondPart} ${newMessage.attachments.size !== 0 ? `${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`)
     }else {
        // filter the message from mentions of users, roles and everyone and sends it 
        var textTwoSend = await replaceMentions(newMessage, newMessage.content);
        channel.send(`${newMessage.channel} ${`\`${newMessage.author.id}\` \`${newMessage.member.nickname ? newMessage.member.nickname:newMessage.author.username}\``} :pencil:: ${textTwoSend}${newMessage.attachments.size !== 0 ? `${newMessage.attachments.map(a => a.url).join('\n')}`: ''}`).then(async (msg) => {
           
           // update last user
           updateLastUser(client, cguild, newMessage, 'none');
  
           // push to the buffer and remove old messages
           var buffer = client.db.get(newMessage.guild.id,'messages.buffer')
           var length = await buffer.push(msg.id);
  
           if (length > settings.messages.bufferLimit) {
             var oldValue = await buffer.shift();
             var oldMsg = await channel.messages.cache.get(oldValue);
             if (!oldMsg) return;
             oldMsg.delete().catch(O_o => {});
           }
           client.db.set(newMessage.guild.id, buffer, 'messages.buffer')
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

  async function removeMessage(fullMessage, part) {

    let finalText = fullMessage.content.replace(await replaceMentions(part, part.content), '');
    finalText = finalText.replace(/https?:\/\/[^\s]+/gi, '');
    finalText = finalText.replace(':pencil:', '');
    finalText = finalText.replace('\n','');
 
   return finalText;
  }