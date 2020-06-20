const {
    Structures
} = require('discord.js');

Structures.extend('GuildMember', GuildMember => {
    class GuildMemberExt extends GuildMember {
        constructor(...args) {
            super(...args);
        }

    }

    return GuildMemberExt;
});