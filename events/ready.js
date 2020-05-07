const { prefix } = require('../config');
const { version } = require('../package.json');
const versions = {
    production: 'Production',
    development: 'Development'
};

var settings =  {
    channelToLog: undefined,
    loggedChannels: [],
    enabled: false
 };

module.exports = async client => {

    client.guilds.cache.map(guild => {
        if(!client.db.has(guild.id)) {
            client.db.set(guild.id,settings);
        }
    });


    await client.logger.log(`Logged in as ${client.user.tag} (${client.user.id}) in ${client.guilds.cache.size} server(s).`);
    await client.logger.log(`Version ${version} of the bot loaded.`);
    
    const cmdHelp = client.commands.get('help', 'help.name');
    
    client.user.setStatus('online');
    client.user.setActivity(`${prefix + cmdHelp}`, { type: 'PLAYING' })
        .catch(err => client.logger.error(err));
};