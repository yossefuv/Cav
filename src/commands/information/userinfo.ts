import { time, CommandInteraction, EmbedBuilder, PermissionFlagsBits, SlashCommandBuilder } from 'discord.js';

module.exports = {
	cooldown: 5,
	category: "information",
    defaultMemberPermissions: PermissionFlagsBits.SendMessages,
	data: new SlashCommandBuilder()
		.setName('userinfo')
		.setDescription('Provides information about the server.')
        .setDMPermission(false)
        .addUserOption(input => input.setName("user").setDescription("Target user you want get into about"))
       ,
	async execute(client: cClient, interaction: CommandInteraction) {
        let User: any = interaction.options.getUser("user") ?? interaction.user;
        User = interaction.guild.members.cache.get(User.id);
      

        var createdOn = User.user.createdTimestamp
        , joinedOn = User.joinedTimestamp

        , roles = User.roles.cache.map(roles => roles).sort((a, b) => b.rawPosition - a.rawPosition)
        , roleslist = ""
       , postion = await getJoinPostion(interaction.guild, User.id); 
       createdOn = Math.floor(createdOn/1000)
       joinedOn = Math.floor(joinedOn/1000)

        roles.forEach(r => {
            let addtexto = `<@&${r.id}>`;
            if ((roleslist.length + addtexto.length + 2) > 1024) {
               
            } else roleslist += addtexto + `  `
        })
        let status = {
            online: 'Online',
            idle: 'Idle',
            dnd: 'Do Not Disturb',
            offline: 'Offline/Invisible'
        };
        const s = '[**»**](https://google.com/)';
        const embed = new EmbedBuilder()
        .setAuthor({ name: `${User.user.tag} | Displaying information on ${User.user.username}`,  iconURL: User.user.displayAvatarURL({ dynamic: true })})
        .setColor(roles[0].name !== '@everyone' ? roles[0].color == 0 ? roles[1].color == 0 ? 0x4dd0e1 : roles[1].color : roles[0].color : 0x4dd0e1)
        .setDescription([
            `${s} **ID**: \`${User.user.id}\``,
            `${s} **Bot?**: \`${User.user.bot ? "Bot": "Not a bot"}\``,
            `${s} **Status**: \`${status[User.presence.status]}\``,
            `${s} **Created on**: ${time(createdOn)} [${time(createdOn, "R")}]`,
            `${s} **Joined on**: ${time(joinedOn)} [${time(joinedOn, "R")}]`,
            `${s} **Server Boosting Since**: \`${User.premiumSince || "Not Boosting"}\``,
            `${s} **Join position**: \`${postion}\``
        ].join("\n"))
       .addFields({name: '**Roles**', value: roleslist})

      await interaction.reply({embeds: [embed]});
	},
};


function getJoinPostion(guild: any,ID: string) { 

    let arr: any = Array.from(guild.members.cache.values());

    arr.sort((a, b) => a.joinedAt - b.joinedAt); 

    for (let i = 0; i < arr.length; i++) { 
      if (arr[i].id == ID) return i;
    }
}