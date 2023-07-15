import { CommandInteraction, EmbedBuilder, InteractionResponse, PermissionFlagsBits, SlashCommandBuilder, TextChannel } from 'discord.js';
import { dget } from '../../utils/db';
import { version } from '../../cpackage.json'
const { limits } = require("../../config")
var [minvalu, maxvalu] = limits.bufferlimit;
module.exports = {
	cooldown: 5,
	category: "moderation",
	defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
	data: new SlashCommandBuilder()
		.setName('buffer')
		.setDescription('removes messages sent by the bot in the logging channel')
		.addStringOption(option => option.setName("is_all").setDescription("choose all to clear all the buffer").setChoices({ name: 'yes all', value: 'true' },{ name: 'or a specific number', value: 'false' }).setRequired(true))
		.addIntegerOption(option => option.setName("specific_number").setDescription("Number to clear from the buffer, type 0 with the all addon to clear all").setMinValue(minvalu).setMaxValue(maxvalu)),

	async execute(client: cClient, interaction: CommandInteraction) {

		var settings = await dget(client, interaction.guild)
        , { channelToLog } = settings
        , { buffer } = settings.messages
		//@ts-ignore
		, isall = interaction.options.getString("is_all")
		//@ts-ignore
		, specificNumber = interaction.options.getInteger("specific_number") ?? 0;

			const embed = new EmbedBuilder()
			.setFooter({ text: `${client.user.username} | Bot Version: ${version}`, iconURL: client.user.avatarURL()})
			.setColor(0x4dd0e1)
		
		if (!buffer || buffer.length === 0) return interaction.reply({content:'the buffer is empty. Try typing something'});
		var channel = interaction.guild.channels.cache.get(channelToLog) as TextChannel;
        if (!channel) return interaction.reply({content: "couldn't find the logging channel"});;

		if (isall == true) {
			embed.setDescription(`Clearing ${buffer.length} message(s)`)
			await interaction.reply({embeds: [embed]}).then(async (int: InteractionResponse) => {
				await clearBuffer(channel, buffer);
				embed.setDescription(`Successfully cleared ${buffer.length} message(s)`)
				await interaction.editReply({embeds: [embed]});
				buffer.empty();
				client.db.set(interaction.guild.id, buffer ,'messages.buffer');
			});

		} else {
			if (specificNumber == 0) return interaction.reply({content: "invaild input, cancelled the command"});
			if (buffer.length < specificNumber) return interaction.reply({content: `Requested amount is larger than currant buffer size: \`${buffer.length}\``});
			embed.setDescription(`Clearing ${specificNumber} message(s)`)
			await interaction.reply({embeds: [embed]}).then(async (int: InteractionResponse) => {
				await clearBuffer(channel, buffer, specificNumber);
				embed.setDescription(`Successfully cleared ${specificNumber} message(s)`)
				await interaction.editReply({embeds: [embed]});
				buffer.slice(buffer.length - specificNumber, buffer.length);
				client.db.set(interaction.guild.id, buffer ,'messages.buffer');
			});


		}
	},
};


var clearBuffer = async (channel, buffer, number:any = 'all') => {
	number = Number(number);
    if (number === 'all') {
        await buffer.forEach(async (m) => {
            var buffMsg = await channel.messages.cache.get(m);
            if (!buffMsg) return;
            buffMsg.delete().catch(O_o => {});
        });
    } else if (!isNaN(number)) {
        for (var i = 0; i < Number(number); i++) {
            var msgID = await buffer.shift()
            , msg = await channel.messages.cache.get(msgID);
                  if (!msg) return;
                  msg.delete().catch(O_o => {});
          }
    } else new Error('iNVAILD INPUT')
}
