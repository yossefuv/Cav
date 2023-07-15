import {ActionRowBuilder, AnySelectMenuInteraction, ButtonBuilder, ButtonInteraction, ButtonStyle, ChatInputCommandInteraction, CommandInteraction, EmbedBuilder, Message, MessageActionRowComponentBuilder, PermissionFlagsBits, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } from 'discord.js';
import { version } from '../../cpackage.json'
import { changeBufferLimit, changeMessageLifetime, dget } from '../../utils/db';

module.exports = {
	cooldown: 5,
	category: "moderation",
  defaultMemberPermissions: PermissionFlagsBits.ManageGuild,
	data: new SlashCommandBuilder()
		.setName('config')
    .setDMPermission(false)
		.setDescription('view&change of configuration of the bot in the server.')
        ,

	async execute(client: cClient, interaction: ChatInputCommandInteraction) {
      
       var getChannel = (ChannelID) => ChannelID ? interaction.guild.channels.cache.get(ChannelID) ? interaction.guild.channels.cache.get(ChannelID) : '\`Channel Deleted or Not found\`': `None`;
       var getRole = (roleID) => roleID ? interaction.guild.roles.cache.get(roleID) ? interaction.guild.roles.cache.get(roleID) : '\`Role Deleted or Not found\`': `None`;
       let embed = new EmbedBuilder()
       .setAuthor({ name: client.user.username,  iconURL: client.user.avatarURL()})
       .setColor(0x4dd0e1)
       .setFooter({ text: `Config | Bot Version: ${version}`})
       .setTimestamp()
       .setDescription(
    [`Welcome to ${client.user.username}'s Config command, here you can view or change any of ${client.user.username} changeable keys`
    ,``
    ,`**Heres an overview of available options you can choose:**`
    ,`\`View\`: Views the all the keys of ${client.user.username}`
    , `\`thresholds\`: Where you can change the limits of available keys`
    , `\`toggles\`: Where you change the state of available toggable keys`
    , `\`channels\`: Where you can add/remove channel(s) of available keys that use channel(s)`
    , `\`roles\`: Where you can add/remove role(s) of available keys that use role(s)`
    ].join('\n'))


       const select = new StringSelectMenuBuilder()
       .setCustomId('starter')
       .setPlaceholder('Make a selection!')
       .addOptions(
           new StringSelectMenuOptionBuilder()
               .setLabel('View')
               .setDescription(`Views the all the keys of ${client.user.username}`)
               .setValue('view'),

           new StringSelectMenuOptionBuilder()
               .setLabel('thresholds')
               .setDescription('Where you can change the limits of available keys')
               .setValue('thresholds'),

           new StringSelectMenuOptionBuilder()
               .setLabel('toggles')
               .setDescription('Where you change the state of available toggable keys')
               .setValue('toggles'),

           new StringSelectMenuOptionBuilder()
               .setLabel('channels')
               .setDescription('Where you can add/remove channel(s) of available keys that use channel(s)')
               .setValue('channels'),

           new StringSelectMenuOptionBuilder()
               .setLabel('roles')
               .setDescription('Where you can add/remove role(s) of available keys that use role(s)')
               .setValue('roles'),
       );
       const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
			.addComponents(select);

       await interaction.reply({embeds: [embed], components: [row]})
       const collector1 = interaction.channel.createMessageComponentCollector({
        max: 1,
        time: 30000
    });
    // Stage 1
    collector1.on('collect', async (int0: AnySelectMenuInteraction) => {
        let subCommand = int0.values[0];
        const settings = await dget(client, interaction.guild);

      // obj name: ["Disaply text", "Database Key", "Settings type", {CUSTOM DATA}]
        // CUSTOM DATA: {
       //   FOR thresholds: {RANGE: [n1,n2]}

       // }
       let options = {
        "defaultMessageLifetime": ["Message Lifetime", "messages.lifetime", "thresholds", {"range": client.config.limits.messageLifetime,  afterChecks: (n) => changeMessageLifetime(client, interaction.guild, n), customin: ``}],
        "defaultBufferLimit": ["Buffer Limit", "messages.bufferLimit", "thresholds", {"range": client.config.limits.bufferlimit,  afterChecks: (n) => changeBufferLimit(client, interaction.guild, n)}],
        "messagesEnabled": ["Message Logging", "messages.enabled", "toggles"],
        "wordLoggingEnabled": ["UsedWords Counter", "messages.wordLogging", "toggles"],
        "deletedLog": ["Log Deleted Messages", "messages.deletedLog", "toggles"],
        "editedLog": ["Log Edited Messages", "messages.editedLog", "toggles"],
        "infiniteLog": ["Disable Logging Limit", "messages.infiniteLog", "toggles"],
        "channelToLog": ["Logging Channel", "channelToLog", "channels", {max: 1}],
        "loggedChannels": ["Channels to log", "loggedChannels", "channels", {max: 50}],
        "modRole": ["Mod Role","modRole", "roles", {max: 1}]
    }


        if (subCommand == `view`) {
        
          const settingsTypes = {
            toggles: [],
            thresholds: [],
            channels: [],
            roles: [],
          };
          
          // Iterate over each option
          for (const key in options) {
            const [optionName, optionPath, optionType, optionParams] = options[key];
          
            // Check the option type and format accordingly
            let optionValue;
            switch (optionType) {
              case "toggles":
                optionValue = d(settings, optionPath) ? "\`Enabled\`" : "\`Disabled\`";
                settingsTypes[optionType].push(`**${optionName}:** ${optionValue}`);
                break;
              case "thresholds":
                const thresholds = optionParams.range;
                optionValue = d(settings, optionPath);
                settingsTypes[optionType].push(`**${optionName}:** \`${optionValue}\`` + ` **=>** Allowed range: **[**${thresholds.map((l: any) => l).join('**,** ')}**]**`);
                break;
              case "channels":
                const channels = optionParams.max === 1 ? [d(settings, optionPath)] : (d(settings, optionPath));
                const channelMentions = channels.map(channel => `${getChannel(channel)}`).join(" ");
                settingsTypes[optionType].push(`**${optionName}:** ${channelMentions}`);
                break;
              case "roles":
                  const roles = optionParams.max === 1 ? [d(settings, optionPath)] : (d(settings, optionPath));
                  const roleMentions = roles.map(role => `${getRole(role)}`).join(" ");
                  settingsTypes[optionType].push(`**${optionName}:** ${roleMentions}`);
                  break;
              default:
                break;
            }
          }
          
          // Construct the description with settings types and their values
          const description = [];
          for (const settingsType in settingsTypes) {
            const settings = settingsTypes[settingsType];
            if (settings.length > 0) {
              description.push(`\`${capitalize(settingsType)}:\`\n${settings.join("\n")}`);
            }
          }
          
          // Set the description in the embed
          embed.setDescription(description.join("\n\n"));
          embed.setFooter({ text: `Config > View | Bot Version: ${version}`})

             int0.update({embeds: [embed], components: []});
        } else {

        let baseText = {
            "thresholds": ["This Thresholds Page of the config command is where you can change the limits of available keys\n\n",(n) => `\n \`Please\` type the new ${n.displayText} that would be used ${n.id == "defaultMessageLifetime" ? "(IN minutes)":""} (typing the same number will cancel the command)`,"\n\n\`*\` **Warning:** By changing this value the existing messages saved in the buffer will be removed"],
            "toggles": ["This Toggle Page of the conifig command is where you can the state of  of available keys\n\n",(n) => "\n \`Please\` type the new state[enable, disable] of the selected key (typing the same state will cancel the command)"],
            "channels": ["This Channels Page of the config command is wherer you can add/remove channel(s) of available keys\n\n",(n) => "\n \`Please\` mention the channel(s) you want to add to add (Max: 10) (mentioning a channel that was saved will remove it)"],
            "roles": ["This Roles Page of the config command is wherer you can add/remove role(s) of available keys\n\n", (n) => "\n \`Please\` mention the role(s) you want to add to add (Max: 10) (mentioning a role that was saved will remove it)"],
          }
        
        let cop = generateConfigOptions(options, subCommand);
        let customtext = generateOptionsText(cop, settings, {getChannel, getRole});
        let mui = ""

        mui += customtext[0] ? customtext[0]: "";
        mui += customtext[1] ? customtext[1] : "";
        embed.setDescription(baseText[subCommand][0] + mui);
        embed.setFooter({ text: `Config > ${capitalize(subCommand)} | Bot Version: ${version}`})
        
        const row1 = new ActionRowBuilder<MessageActionRowComponentBuilder>();
        for (const option of cop) {
          const { id, displayText } = option;
          row1.addComponents(
            new ButtonBuilder()
              .setCustomId(`${id}`)
              .setLabel(`${displayText}`)
              .setStyle(ButtonStyle.Primary)
          );
      
        }

        int0.update({embeds: [embed], components: [row1]});

        const collector1 = interaction.channel.createMessageComponentCollector({
            max: 1,
            time: 35000
        });
        // Stage 2
        collector1.on('collect', async (int: ButtonInteraction) => {
          try {
            let optionStage2 = cop.filter((i) => i.id == int.customId);
            let textGenStage2 = generateOptionsText(optionStage2, settings, {getChannel, getRole});
          let m = baseText[subCommand][0];
          m += textGenStage2[0] ? textGenStage2[0]: "";
          m += textGenStage2[1] ? textGenStage2[1] : "";
          m += baseText[subCommand][1](optionStage2[0]);
          m += baseText[subCommand][2] ? baseText[subCommand][2]:"";
        embed.setDescription(m);
        embed.setFooter({ text: `Config > ${capitalize(subCommand)} > ${optionStage2[0].displayText} | Bot Version: ${version}`})
        await int.update({embeds: [embed], fetchReply: true, components: []}).then(() => {
          const collectorFilter = m => m.author.id == interaction.user.id;
          interaction.channel.awaitMessages({ filter: collectorFilter, max: 1, time: 30000, errors: ['time'] })
            .then(collected => {
              // Stage 3
              return handleInputGiven(client, interaction, int, collected.first(), {optionStage2, settings});
            })
            .catch(collected => {
              interaction.followUp({content: "Command Timeout", ephemeral: true});
            });
        });
      } catch (e) {
        console.log(e);
      }
        });

    }});
 
	},
};

const generateConfigOptions = (options: object, settingTypeFilter: string) => {
    const configOptions = [];
  
    for (const key in options) {
      const [displayText, databaseKey, settingType, customConfig] = options[key];
  
      if (settingType === settingTypeFilter || !settingTypeFilter) {
        const option = {
          id: key,
          displayText,
          databaseKey,
          settingType,
          customConfig
        };
  
        configOptions.push(option);
      }
    }
  
    return configOptions;
  };

const generateOptionsText = (configOptions: any, settings: object, {getChannel, getRole}) => {
    let configOptionsText = '';
    var out = [];
    for (const option of configOptions) {
      const { displayText, databaseKey, settingType, customConfig } = option;
    if (settingType == "channels" || settingType == "roles") {
        let getrolee = {
            "channels": getChannel,
            "roles": getRole
        }
        if (customConfig.max == 1) {
            configOptionsText += `**[${displayText}]**: ${getrolee[settingType](d(settings,databaseKey))}\n`;
        } else {
            const savedChannelsOrRoles = d(settings, databaseKey);
            let currindex = 0;
            let temptext = '';
    
            for (const value of savedChannelsOrRoles) {
              const channelOrRole = getrolee[settingType](value);
              const startt = `**[${displayText}]**:`
              const valueText = ` ${channelOrRole}`;

              if (temptext.length + valueText.length > 3200) {
                out.push(temptext);
                currindex++;
                temptext = startt + valueText;
              } else {
                if (temptext === '') {
                  temptext += `**[${displayText}]**:`;
                }
                temptext += valueText;
              }
            }

            out.push(temptext);
        }
    } else {
    let value = d(settings,databaseKey);
      if (settingType == "toggles") {
        value = value ? "Enabled":"Disabled";
      }
  
      configOptionsText += `**[${displayText}]**: \`${value}\``;
      if (settingType == "thresholds") {
        configOptionsText += ` **=>** Allowed range: **[**${customConfig.range.map((l: any) => l).join('**,** ')}**]**`
      }
      configOptionsText += `\n`;
    }
    }
    let outf = [configOptionsText];
    outf.push(...out);
    return outf;
  }; 
  
  const handleInputGiven = async (client: cClient, interaction: CommandInteraction, int: ButtonInteraction, collected: Message, {optionStage2, settings}: any) => {
      let options = optionStage2[0];
      let oldKey = d(settings, options.databaseKey);
      try {
    if (options.settingType == "thresholds") {
      let co = Number(collected.content);
      let oldn = Number(oldKey);
     
        if (!isNaN(co) && co >= options.customConfig.range[0] && co <= options.customConfig.range[1] && co != oldn) {
          await client.db.set(interaction.guild.id, co, options.databaseKey);
          if (options.customConfig.afterChecks) options.customConfig.afterChecks(client,interaction.guild, co);
          int.followUp({content: `Successfully changed the key **${options.displayText}** value from \`${oldn}\` to \`${co}\``})
        } else {int.followUp({content: `Invalid input, canceled the command`, ephemeral: true})}
  
        
      } else if (options.settingType == "toggles") {

            let co = collected.content.toLocaleLowerCase();
            let oldState = oldKey ? "Enabled":"Disabled";
            if (["enable", "enabled" , "disable", "disabled"].includes(co) && (co == "enable" || co == "enabled") != (oldState == "enabled")) {

                await client.db.set(interaction.guild.id, (co == "enable" || co == "enabled") ? true:false, options.databaseKey);
                int.followUp({content: `Successfully changed the key **${options.displayText}** value from \`${oldState}\` to \`${co}\``})
              } else {int.followUp({content: `Invalid input, canceled the command`, ephemeral: true})}
      } else {
        let currentChannelsOrROles = d(settings, options.databaseKey);
            let chmos = {
                "channels": collected.mentions.channels,
                "roles": collected.mentions.roles
            }
        const uniqueChannelsOrRoles = new Set(chmos[options.settingType].values());

        const firstXUniqueChannelsOrRoles = Array.from(uniqueChannelsOrRoles).slice(0, options.customConfig.max);
        if (options.customConfig.max > 1) {
        let addedCount = 0;
        let removedCount = 0;
        console.log(currentChannelsOrROles)
        console.log(firstXUniqueChannelsOrRoles)
        console.log("====================+++++++++++=")
          // Remove channel IDs that are in the array but not mentioned
          const removedIDs = [];
          for (const mbv of firstXUniqueChannelsOrRoles) {
            currentChannelsOrROles = currentChannelsOrROles.filter(id => {
              //@ts-ignore
              if (id != mbv.id) {
                console.log("RAAAAAAAAAA")
                return true;
              } else {
                removedIDs.push(id);
                return false;
              }
            });
          }
          
          removedCount = removedIDs.length;
        console.log(currentChannelsOrROles)
        console.log("=====================")
        console.log(removedIDs)

        for (const mention of firstXUniqueChannelsOrRoles) {
            //@ts-ignore
            if (!currentChannelsOrROles.includes(mention.id) && !removedIDs.includes(mention.id)) {
             //@ts-ignore
                currentChannelsOrROles.push(mention.id);
              addedCount++;
            }
          }
          await client.db.set(interaction.guild.id, currentChannelsOrROles, options.databaseKey);
          int.followUp({content: `Successfully Added **${addedCount}** ${capitalize(options.settingType)} ${removedCount > 0 ? `and Removed **${removedCount}** ${capitalize(options.settingType)}`:``} to the key **${options.displayText}**`})

        } else {
            var getChannel = (ChannelID) => ChannelID ? interaction.guild.channels.cache.get(ChannelID) ? interaction.guild.channels.cache.get(ChannelID) : '\`Channel Deleted or Not found\`': `None`;
            var getRole = (roleID) => roleID ? interaction.guild.roles.cache.get(roleID) ? interaction.guild.roles.cache.get(roleID) : '\`Role Deleted or Not found\`': `None`;
            let getrolee = {
                "channels": getChannel,
                "roles": getRole
            }
            const [first] = firstXUniqueChannelsOrRoles as any;

            const isSameVal = d(settings, options.databaseKey) == first.id;
            //@ts-ignore
            if (!isSameVal) { 
            int.followUp({content: `Successfully set the ${capitalize(options.settingType)} **${getrolee[options.settingType](first.id)}** to the key **${options.displayText}**`})
            //@ts-ignore
            await client.db.set(interaction.guild.id, first.id, options.databaseKey);
            } else {
              int.followUp({content: `Successfully removed the ${capitalize(options.settingType)} of the key **${options.displayText}**`})
              //@ts-ignore
              await client.db.set(interaction.guild.id, undefined, options.databaseKey);
            }
        }

      }
    }catch(e) {
        console.log("Error:")
        console.log(e);
        int.followUp({content: `Unknown Error, canceled the command`, ephemeral: true})
    }
  
  } 
  
 const d = (o, k) => k.split('.').reduce((a, c, i) => {
      let m = c.match(/(.*?)\[(\d*)\]/);
      if (m && a != null && a[m[1]] != null) return a[m[1]][+m[2]];
      return a == null ? a : a[c];
  }, o);  

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);