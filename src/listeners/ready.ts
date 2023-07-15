import { ActivityType, Events } from "discord.js";
import { regCMD } from "../deploy-commands";
import { version } from "../cpackage.json";
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: cClient) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		 client.guilds.cache.map(guild => {
            if(!client.db.has(guild.id)) {
             client.db.set(guild.id, {
              messages: {
                  enabled: false,
                  deletedLog: false,
                  editedLog: false, 
                  infiniteLog: false,
                  lifetime:  client.config.defaultMessageLifetime,
                  bufferLimit:  client.config.defaultBufferLimit,
                  wordLogging: false,
                   usedWords: {}, 
                   count: 0,
                   lastUser: 'none',
              },
              modRole: undefined,
              channelToLog: undefined,
              loggedChannels: [],
          });
         }  else {
            client.db.delete(guild.id, 'messages.buffer');
         }
        });

		resetStatus(client);
        setInterval(() => {
          resetStatus(client);
        }, 3600000);
        regCMD(client.user.id)
	},
};
function resetStatus(client: cClient) {
    client.user.setStatus('online');
       client.user.setActivity(`/help | ${version}`, { type: ActivityType.Listening })    
}