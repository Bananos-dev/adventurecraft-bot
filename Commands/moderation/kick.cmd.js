const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "kick",
	description: "Kick a member from the server",
	options: [
		{
			name: "member",
			description: "member to kick",
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: "reason",
			description: "Reason for kick",
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

		if (!targetMember.bannable) {
			return await interaction.editReply(
				getErrorReplyContent("This member can't be banned.")
			);
		}

		await targetMember.kick(reason);

		await interaction.editReply(
			getSuccessReplyContent(
				`Member: ${user.tag} has been kicked for ${reason}.`
			)
		);

		const record = await memberPunishmentSchema.create({
			action: "kick",
			executedUserId: executedMember.user.id,
			executedUserTag: executedMember.user.tag,
			targetUserId: user.id,
			targetUserTag: user.tag,
			reason: reason,
			status: "completed",
		});

		await postLog(
			interaction.guild,
			executedMember,
			targetMember,
			"Kick",
			reason,
			record.id
		);
	},
};
