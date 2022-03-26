const { Client, CommandInteraction, MessageEmbed, Message, } = require("discord.js");
const config = require("../../config.json");
const {adminOptionsRow} = require("../../Commands/bug.cmd");
const bugreportSchema = require("../../Schemas/bugreport-schema");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            try {
                command.execute(interaction, client);
            } catch(error) {
                console.error(error)
                const commandExecutionErrorEmbed = new MessageEmbed()
                .setTitle("Error")
                .setColor(config.error_color)
                .setDescription("There was an error while executing this command.")
                .setFooter("Coded by Bananos#1874, this bot is open source: github.com/Bananos-dev/adventurecraft-bot")

                client.guilds.cache.get(config.guild_id).channels.cache.get(config.error_log_channel_id).send({
                    embeds: {
                        commandExecutionErrorEmbed
                    }
                });
            }
        }
        if(interaction.isButton()) {  //client.login(config.token)
            if(interaction.customId === "reviewingBugReport") {
                adminOptionsRow.components[0].setDisabled(true);
                interaction.update({components: [adminOptionsRow]})
                adminOptionsRow.components[0].setDisabled(false);

                const bugId = interaction.message.embeds[0].fields[0].value
                
                await bugreportSchema.updateOne( { id: bugId }, { status: "review"} );
                const bugInfo = await bugreportSchema.findOne({id: bugId,});

                if(bugInfo.status === "review") {
                    adminOptionsRow.components[0].setDisabled(true);
                    interaction.update({components: [adminOptionsRow]})
                }

                let underReviewEmbed = new MessageEmbed()
                .setColor(config.neutral_color)
                .setTitle(interaction.message.embeds[0].title)
                .addFields(
                    interaction.message.embeds[0].fields[0],
                    interaction.message.embeds[0].fields[1],
                    interaction.message.embeds[0].fields[2],
                    {name: "Status", value: "\`🔵 Under review\`"},
                    interaction.message.embeds[0].fields[4],
                )

                let dmUnderReviewEmbed = new MessageEmbed()
                .setColor(config.neutral_color)
                .setTitle(`Updated report #${bugInfo.id}`)
                .setDescription(`Your bug report has been marked as \`🔵 Under review\`.\nThanks for helping make AC a better place!`)
                .addFields({name: "Your report:", value: `${bugInfo.content}`, inline: false})
                .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

                try {
                    interaction.message.edit({embeds: [underReviewEmbed]});
                    interaction.message.edit({embeds: [underReviewEmbed]});
                    client.users.cache.get(bugInfo.userId).send({ embeds: [dmUnderReviewEmbed] });
                } catch(err) {
                    console.error(error)
                }

            } else if(interaction.customId === "acceptBugReport") {
                adminOptionsRow.components[0].setDisabled(true);
                adminOptionsRow.components[1].setDisabled(true);
                adminOptionsRow.components[2].setDisabled(true);
                interaction.update({components: [adminOptionsRow]})
                adminOptionsRow.components[0].setDisabled(false);
                adminOptionsRow.components[1].setDisabled(false);
                adminOptionsRow.components[2].setDisabled(false);

                const bugId = interaction.message.embeds[0].fields[0].value
                
                await bugreportSchema.updateOne( { id: bugId }, { status: "accepted"} );
                const bugInfo = await bugreportSchema.findOne({id: bugId,});

                if(bugInfo.status === "accepted") {
                    adminOptionsRow.components[0].setDisabled(true);
                    adminOptionsRow.components[1].setDisabled(true);
                    adminOptionsRow.components[2].setDisabled(true);
                    interaction.update({components: [adminOptionsRow]})
                }

                let acceptedEmbed = new MessageEmbed()
                .setColor(config.neutral_color)
                .setTitle(interaction.message.embeds[0].title)
                .addFields(
                    interaction.message.embeds[0].fields[0],
                    interaction.message.embeds[0].fields[1],
                    interaction.message.embeds[0].fields[2],
                    {name: "Status", value: "\`🟢 Accepted\`"},
                    interaction.message.embeds[0].fields[4],
                )
                let dmAcceptEmbed = new MessageEmbed()
                .setColor(config.neutral_color)
                .setTitle(`Updated report #${bugInfo.id}`)
                .setDescription(`Your bug report has been marked as \`🟢 Accepted\`.\nThanks for helping make AC a better place!`)
                .addFields({name: "Your report:", value: `${bugInfo.content}`, inline: false})
                .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

                //Send the notifications
                try {
                    interaction.message.edit({embeds: [acceptedEmbed]});
                    interaction.message.edit({embeds: [acceptedEmbed]});
                    client.users.cache.get(bugInfo.userId).send({ embeds: [dmAcceptEmbed] });
                } catch(err) {
                    console.error(error)
                }
            } else if(interaction.customId === "declineBugReport") {
                adminOptionsRow.components[0].setDisabled(true);
                adminOptionsRow.components[1].setDisabled(true);
                adminOptionsRow.components[2].setDisabled(true);
                interaction.update({components: [adminOptionsRow]})
                adminOptionsRow.components[0].setDisabled(false);
                adminOptionsRow.components[1].setDisabled(false);
                adminOptionsRow.components[2].setDisabled(false);

                const bugId = interaction.message.embeds[0].fields[0].value
                await bugreportSchema.updateOne( { id: bugId }, { status: "declined"} );
                const bugInfo = await bugreportSchema.findOne({id: bugId,});

                if(bugInfo.status === "declined") {
                    adminOptionsRow.components[0].setDisabled(true);
                    adminOptionsRow.components[1].setDisabled(true);
                    adminOptionsRow.components[2].setDisabled(true);
                    interaction.update({components: [adminOptionsRow]})
                    adminOptionsRow.components[0].setDisabled(false);
                    adminOptionsRow.components[1].setDisabled(false);
                    adminOptionsRow.components[2].setDisabled(false);
                }

                let declinedEmbed = new MessageEmbed()
                .setColor(config.neutral_color)
                .setTitle(interaction.message.embeds[0].title)
                .addFields(
                    interaction.message.embeds[0].fields[0],
                    interaction.message.embeds[0].fields[1],
                    interaction.message.embeds[0].fields[2],
                    {name: "Status", value: "\`🔴 Declined\`"},
                    interaction.message.embeds[0].fields[4],
                )
                let dmDeclineEmbed = new MessageEmbed()
                .setColor(config.neutral_color)
                .setTitle(`Updated report #${bugInfo.id}`)
                .setDescription(`Sorry, your bug report has been marked as \`🔴 Declined\`.\nStill, thanks for helping make AC a better place!`)
                .addFields({name: "Your report:", value: `${bugInfo.content}`, inline: false})
                .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

                try {
                    interaction.message.edit({embeds: [declinedEmbed]});
                    interaction.message.edit({embeds: [declinedEmbed]});
                    client.users.cache.get(bugInfo.userId).send({ embeds: [dmDeclineEmbed] });
                } catch(err) {
                    console.error(error)
                }
            }
        }
    }
}