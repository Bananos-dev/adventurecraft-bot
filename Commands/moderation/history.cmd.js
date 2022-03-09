const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "history",
	description: "View punishment history of a member",
	options: [
		{
			name: "member",
			description: "member in the server",
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

		const history = await memberPunishmentSchema
			.find({
				targetUserId: user.id,
			})
			.sort({ createdAt: -1 })
			.limit(5);

		if (history.length === 0) {
			return interaction.editReply(
				getSuccessReplyContent(
					"This member doesn't have any punishment history."
				)
			);
		}

		await interaction.editReply(
			getSuccessReplyContent("Member punishment history has been retrieved.")
		);

		for (const h of history) {
			const embed = {
				color: "BLURPLE",
				fields: [
					{ name: "ID", value: h.id.toString() },
					{ name: "Action", value: h.action },
					{
						name: "Target User",
						value: `${h.targetUserTag}(<@${h.targetUserId}>)`,
					},
					{
						name: "Executed User",
						value: `${h.executedUserTag}(<@${h.executedUserId}>)`,
					},
					{
						name: "Date",
						value: `<t:${Math.floor(h.createdAt.getTime() / 1000)}:F>`,
					},
				],
			};

			if (h.action === "warn") {
				embed.fields.push({
					name: "Valid Until",
					value: `<t:${Math.floor(h.validUntil.getTime() / 1000)}:F>`,
				});
			}

			embed.fields.push({
				name: "Status",
				value: h.status,
			});

			await interaction.channel.send({
				embeds: [embed],
			});
		}
	},
};
