const { prefix, messageTimeout } = require('../config');
const { version } = require('../package.json');

var settings =  {
    channelToLog: undefined,
    preferences: {
     mention: false,
     removeCommonWords: true,
    },
    messages: {
         usedWords: {}, 
         count: 0,
         lastUser: 'none',
         cases: 0,
         case: [],
         records: {

         }
         /*
       "MessageID": {
           timestap: nice,
       }
         */
    },
    loggedChannels: [],
    enabled: false
 };

module.exports = async client => {

    client.guilds.cache.map(guild => {
        if(!client.db.has(guild.id)) {
            client.db.set(guild.id,settings);
        }
    });

  await client.db.set('messageRecords', {});
  setInterval(async () => {
      var y = {};
      var z = await	Object.entries(await client.db.get('messageRecords'));
     if (!z.length) return;
      var x = z.filter(([key, value]) => {
        return (new Date().getTime() - value.timestap) <= messageTimeout*1000; 
       });
        x.map(([key, value]) => {
            y[key] = value;
        });
        client.db.set('messageRecords', y);
    }, messageTimeout*1000);
    
    

    await client.logger.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.cache.size} server(s).`);
    await client.logger.log(`Version ${version} of the bot loaded.`);
    
    const cmdHelp = client.commands.get('help', 'help.name');
    
    client.user.setStatus('online');
    client.user.setActivity(`${prefix + cmdHelp}`, { type: 'PLAYING' })
        .catch(err => client.logger.error(err));
};

