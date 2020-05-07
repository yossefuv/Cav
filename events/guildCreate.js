
var settings =  {
   channelToLog: undefined,
   loggedChannels: [],
   enabled: false
};

module.exports = async (client, guild) => {

   if(!client.db.has) {
    client.db.set(guild.id,settings);
   }

};