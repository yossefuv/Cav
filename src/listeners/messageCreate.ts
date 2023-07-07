import type { Message } from 'discord.js';
import {Events} from 'discord.js';
import { dget, log, updateLastUser } from "../utils/db"
//import { helpro } from '../utils/helputil';

module.exports = {
	name: Events.MessageCreate,
	async execute(client: cClient, message: Message) {
        if (!message.guild || message.author.bot) return;
        LogMsg(client, message.guild, message)

	},
};



async function LogMsg(client: cClient,guild: cGuild, message: Message) {
    var settings = await dget(client, guild);
    console.log(settings)
    if (!settings.messages.enabled) return;
    
    if (settings.messages.wordLogging) {
		let { usedWords, count } = settings.messages;
        
        //	let temp =// await commonRemover.remove(message.content.toLowerCase())
            let temp = await message.content.toLowerCase().replace(/[^\w\s]+/gi, '');
            temp = await temp.replace(/(\b(\w{1,3})\b(\W|$))/gi, '');

		   const msgArr = temp.split(' ');
			await msgArr.map(w => {
                if(w == '') return;
				usedWords[w] ? (usedWords[w] += 1) : (usedWords[w] = 1);
			});
			client.db.set(message.guild.id, usedWords, 'messages.usedWords');
			client.db.set(message.guild.id, (count += 1), 'messages.count');
    }


    // checks if the channel is in the channels to log
    if (settings.loggedChannels.includes(message.channel.id) && settings.channelToLog !== message.channel.id) {


         // checks for the channel to log the message and gets the channel
        if (!settings.channelToLog) return;
        const channel = await message.guild.channels.fetch(settings.channelToLog);
        if (!channel) return;
        // filters the message to remove mentions of users, roles
        var contentToSend = await replaceMentions(message, message.content);
        //@ts-ignore
      await log(client, guild, message, `${message.channel} ${(guild.lastUser || '') === `${message.channel.id}.${message.author.id}` ? '...' : `\`${message.author.id}\` \`${message.member.nickname ? message.member.nickname:message.author.username}\`:`} ${contentToSend}${message.attachments.size !== 0 ? `\n${message.attachments.map(a => a.url).join('\n')}`: ''}`, channel);
            updateLastUser(client, guild, message);
        }

 
}
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
