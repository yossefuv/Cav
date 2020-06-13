
var settings =  {
   channelToLog: undefined,
   loggedChannels: [],
   enabled: false
};

module.exports = async (client, guild) => {

   if(!client.db.has(guild.id)) {
    client.db.set(guild.id,settings);
   }

};