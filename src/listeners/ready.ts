import { ActivityType, Events } from "discord.js";
import { regCMD } from "../deploy-commands";
import { version } from "../cpackage.json";
module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client: cClient) {
		console.log(`Ready! Logged in as ${client.user.tag}`);

		 client.guilds.cache.map(guild => {
      
           /* if(client.db.has(guild.id)) {
             client.db.set(guild.id, {
              messages: {
                  enabled: false,
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
         }  */
        });
/*         client.db.set("1117933911654289542", true, 'messages.enabled');
        client.db.set("1117933911654289542", "1126978720742256851", 'channelToLog');
        client.db.set("1117933911654289542", ["1117933912879022183"], 'loggedChannels'); */

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