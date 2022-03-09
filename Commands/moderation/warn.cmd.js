const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "warn",
	description: "Warn a member in the server",
	options: [
		{
			name: "member",
			description: "member to warn",
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: "reason",
			description: "Reason for warning",
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
		const reason = interaction.options.getString("reason", true);

		const targetMember = await interaction.guild.members.fetch(user);

		await targetMember.user.send(
			`You have been warned for **${reason}**. Please refrain from doing this again.`
		);

		await interaction.editReply(
			getSuccessReplyContent(
				`Member: ${user.tag} has been warned for ${reason}.`
			)
		);

		const record = await memberPunishmentSchema.create({
			action: "warn",
			executedUserId: executedMember.user.id,
			executedUserTag: executedMember.user.tag,
			targetUserId: user.id,
			targetUserTag: user.tag,
			reason: reason,
			validUntil: new Date(new Date().getTime() + 30 * 8.64e7),
			status: "active",
		});

		await postLog(
			interaction.guild,
			executedMember,
			targetMember,
			"Warn",
			reason,
			record.id
		);

		// check if user has 3 or more active warns
		const warnings = await memberPunishmentSchema.find({
			targetUserId: user.id,
			status: "active",
		});

		// if member is not bannable or warnings is less than 3 ignore
		if (warnings.length < 3 || !targetMember.bannable) return;

		const banReason = "Accumulated more than three warnings.";

		await targetMember.ban({ reason: banReason });

		await postLog(
			interaction.guild,
			interaction.guild.me,
			targetMember,
			"Ban",
			banReason,
			record.id
		);

		await memberPunishmentSchema.create({
			action: "ban",
			executedUserId: interaction.client.user.id,
			executedUserTag: interaction.client.user.tag,
			targetUserId: user.id,
			targetUserTag: user.tag,
			reason: banReason,
			status: "completed",
		});

		// update active warnings
		await memberPunishmentSchema.updateMany(
			{ targetUserId: user.id, action: "warn", status: "active" },
			{ $set: { status: "completed" } },
			{ multi: true }
		);
	},
};
