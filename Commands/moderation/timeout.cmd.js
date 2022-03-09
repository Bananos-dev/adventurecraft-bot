const { Constants, CommandInteraction } = require("discord.js");
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
		await interaction.deferReply({ ephemeral: true });

		const executedMember = await interaction.guild.members.fetch(
			interaction.user
		);

		if (
			!executedMember.roles.cache.get(config.mod_role_id) &&
			!executedMember.permissions.has("ADMINISTRATOR")
		) {
			return interaction.editReply(
				getErrorReplyContent("You don't have permission to run this command.")
			);
		}
		const user = interaction.options.getUser("member", true);
		const duration = interaction.options.getNumber("duration", true);
		const unit = interaction.options.getString("unit", true);
		const reason = interaction.options.getString("reason", true);

		const targetMember = await interaction.guild.members.fetch(user);

		if (
			targetMember.communicationDisabledUntil &&
			targetMember.communicationDisabledUntil >= new Date()
		) {
			return await interaction.editReply(
				getErrorReplyContent("This member is already timed out.")
			);
		}

		if (!targetMember.manageable) {
			return await interaction.editReply(
				getErrorReplyContent("This member can't be timed out.")
			);
		}

		const ms = getMilliseconds(duration, unit);

		await targetMember.timeout(ms, reason);

		await interaction.editReply(
			getSuccessReplyContent(
				`Member: ${user.toString()} has been timed out for ${reason}.`
			)
		);

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
