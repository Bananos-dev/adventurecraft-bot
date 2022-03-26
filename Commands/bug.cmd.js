const { Constants, CommandInteraction, MessageEmbed, MessageActionRow, MessageButton, Message } = require("discord.js");
const config = require("../config.json");
const bugreportSchema = require("../Schemas/bugreport-schema");
const { sendError } = require("../Utils/common.util");

let adminOptionsRow = new MessageActionRow().addComponents(
    new MessageButton()
    .setCustomId("reviewingBugReport")
    .setLabel("Review")
    .setStyle("PRIMARY"),

    new MessageButton()
    .setCustomId("acceptBugReport")
    .setLabel("Accept")
    .setStyle("SUCCESS"),
    
    new MessageButton()
    .setCustomId("declineBugReport")
    .setLabel("Decline")
    .setStyle("DANGER")
)

module.exports = {
	name: "bug",
	description: "Report a bug you found in the bot",
	options: [
		{
			name: "bug",
			description: "Please describe the bug as well as the steps needed to recreate it.",
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		},
	],

	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction, client) {
        const record = await bugreportSchema.create({
            time: Date.now(),
            userId: interaction.member.user.id,
            content: interaction.options.getString("bug"),
            status: "pending",
        });
    
        let replyEmbed = new MessageEmbed()
        .setColor(config.neutral_color)
        .setTitle("Thank you!")
        .setDescription(`Thanks for helping improve AC! We're really grateful for your support. Your report has been submitted and will be reviewed by Bananos as soon as possible.`)
        .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });
    
        let dmEmbed = new MessageEmbed()
        .setColor(config.neutral_color)
        .setTitle(`Submitted report #${record.id}`)
        .setDescription(`Your bug report has been successfully submitted and will be reviewed by Bananos as soon as possible. You will be notified of the outcome.`)
        .addFields({name: "Your report:", value: `${interaction.options.getString("bug")}`, inline: false})
        .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });
    
        let reportEmbed = new MessageEmbed()
        .setColor(config.neutral_color)
        .setTitle(`Bug report #${record.id}`)
        .addFields(
            {name: "Report ID", value: `${record.id}`, inline: true},
            {name: "User", value: `${record.userId}`, inline: true},
            {name: "Time of report", value: `<t:${record.time}:d> at <t:${record.time}:T>`, inline: true},
            {name: "Status", value: "\`⚪ Pending\`"},
            {name: "Content of report", value: `${record.content}`, inline: false},
        )
        //Send all the notifications
        try {
            interaction.reply({embeds: [replyEmbed]});
            client.users.cache.get(interaction.member.user.id).send({ embeds: [dmEmbed] });
            client.channels.cache.get("956680298563780609").send({ embeds: [reportEmbed], components: [adminOptionsRow]});
        } catch(error) {
            sendError(error)
        }
    },
    adminOptionsRow
    
};
