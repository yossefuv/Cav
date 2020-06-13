

var settings =  {
   channelToLog: undefined,
   preferences: {
    mention: false,
    removeCommonWords: true,
   },
   messages: {
        usedWords: {}, 
        count: 0,
        lastUser: 'none'
   },
   loggedChannels: [],
   enabled: false
};

module.exports = async (client, guild) => {

    client.db.set(guild.id,settings);
   

};