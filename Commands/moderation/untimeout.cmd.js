const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "untimeout",
	description: "Remove timeout from a member",
	options: [
		{
			name: "member",
			description: "Member to remove a timeout from",
			type: Constants.ApplicationCommandOptionTypes.USER,
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

		const targetMember = await interaction.guild.members
			.fetch(user)
			.catch((e) => {});

		if (!targetMember) {
			return interaction.editReply(
				getErrorReplyContent(
					"Invalid selection", "Member you mentioned doesn't exist in the server."
				)
			);
		}

		if (
			!targetMember.communicationDisabledUntil ||
			targetMember.communicationDisabledUntil < new Date()
		) {
			return await interaction.editReply(
				getErrorReplyContent("Invalid selection","This member is not timed out.")
			);
		}

		if (!targetMember.manageable) {
			return await interaction.editReply(
				getErrorReplyContent("Invalid Selection", "This member can't be untimed out.")
			);
		}

		await targetMember.timeout(null);

		await targetMember.user
			.send({
				embeds: [
					{
						color: config.neutral_color,
						description: `Your timeout has been removed.`,
					},
				],
			})
			.catch((_) => {});

		await interaction.editReply(
			getSuccessReplyContent(
				"Timeout removed", `Timeout has been removed from the member ${user.toString()}.`
			)
		);

		await postLog(
			interaction.guild,
			executedMember,
			targetMember,
			`Timeout Removed`,
			"None"
		);
	},
};
