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
			description: "member to timeout",
			type: Constants.ApplicationCommandOptionTypes.USER,
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

		const targetMember = await interaction.guild.members
			.fetch(user)
			.catch((e) => {});

		if (!targetMember) {
			return interaction.editReply(
				getErrorReplyContent(
					"Member you mentioned doesn't exist in the server."
				)
			);
		}

		if (
			!targetMember.communicationDisabledUntil ||
			targetMember.communicationDisabledUntil < new Date()
		) {
			return await interaction.editReply(
				getErrorReplyContent("This member is not timed out.")
			);
		}

		if (!targetMember.manageable) {
			return await interaction.editReply(
				getErrorReplyContent("This member can't be untimed out.")
			);
		}

		await targetMember.timeout(null);

		await targetMember.user
			.send({
				embeds: [
					{
						color: "GREEN",
						description: `Your timeout has been removed`,
					},
				],
			})
			.catch((_) => {});

		await interaction.editReply(
			getSuccessReplyContent(
				`Timeout has been removed from the member ${user.toString()}.`
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
