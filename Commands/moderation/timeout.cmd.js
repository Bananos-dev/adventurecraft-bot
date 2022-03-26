const { Constants, CommandInteraction, MessageEmbed } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
	getMilliseconds,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "timeout",
	description: "Timeout a member for a specific amount of time",
	options: [
		{
			name: "member",
			description: "member to timeout",
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: "duration",
			description: "Duration for timeout",
			type: Constants.ApplicationCommandOptionTypes.NUMBER,
			required: true,
		},
		{
			name: "unit",
			description: "Time unit of duration",
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
			choices: [
				{ name: "Seconds", value: "s" },
				{ name: "Minutes", value: "m" },
				{ name: "Hours", value: "h" },
				{ name: "Days", value: "d" },
				{ name: "Weeks", value: "w" },
			],
		},
		{
			name: "reason",
			description: "Reason for timeout",
			type: Constants.ApplicationCommandOptionTypes.STRING,
			required: true,
		},
	],
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const executedMember = await interaction.guild.members.fetch(
			interaction.user
		);

		if (!executedMember.roles.cache.get(config.admin_role_id) || !executedMember.roles.cache.get(config.owner_role_id) || !executedMember.roles.cache.get(config.helper_role_id)) {
			return interaction.editReply(
				getErrorReplyContent("Missing permissions", "Only staff may execute this command")
			)
		}
		const user = interaction.options.getUser("member", true);
		const duration = interaction.options.getNumber("duration", true);
		const unit = interaction.options.getString("unit", true);
		const reason = interaction.options.getString("reason", true);

		const targetMember = await interaction.guild.members
			.fetch(user)
			.catch((e) => {});

		if (!targetMember) {
			return interaction.editReply(
				getErrorReplyContent(
					"Invalid selection","Member you mentioned doesn't exist in the server."
				)
			);
		}

		if (
			targetMember.communicationDisabledUntil &&
			targetMember.communicationDisabledUntil >= new Date()
		) {
			return await interaction.editReply(
				getErrorReplyContent("Invalid selection", "This member is already timed out.")
			);
		}

		if (!targetMember.manageable) {
			return await interaction.editReply(
				getErrorReplyContent("Invalid selection","This member can't be timed out.")
			);
		}

		const ms = getMilliseconds(duration, unit);

		await targetMember.timeout(ms, reason);

		const record = await memberPunishmentSchema.create({
			action: "timeout",
			executedUserId: executedMember.user.id,
			executedUserTag: executedMember.user.tag,
			targetUserId: user.id,
			targetUserTag: user.tag,
			duration: duration,
			durationUnit: unit,
			reason: reason,
			validUntil: new Date(new Date().getTime() + ms),
			status: "completed",
		});

		let sendEmbed = new MessageEmbed()
		.setColor(config.neutral_color)
		.setTitle("Punishment updated")
		.addFields(
			{ name: "Action", value: "Timeout", inline: true},
			{ name: "Duration", value: `${duration}${unit}`, inline: true},
			{ name: "Reason", value: `${reason}`, inline: true},
			{ name: "Punishment ID", value: `${record.id}`},
		)

		await targetMember.user.send({ embeds: [sendEmbed] }).catch((_) => {});

		await interaction.editReply(
			getSuccessReplyContent(
				"User timed out", `${user.toString()} has been timed out for ${duration}${unit} for ${reason}`
			)
		);

		await postLog(
			interaction.guild,
			executedMember,
			targetMember,
			`Timeout ${duration}${unit}`,
			reason,
			record.id
		);
	},
};
