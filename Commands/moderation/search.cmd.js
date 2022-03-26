const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "search",
	description: "View a punishment",
	options: [
		{
			name: "id",
			description: "ID of the punishment.",
			type: Constants.ApplicationCommandOptionTypes.INTEGER,
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

		const id = interaction.options.getInteger("id", true);

		const punishment = await memberPunishmentSchema.findOne({
			id,
		});

		if (!punishment) {
			return interaction.editReply(
				getErrorReplyContent("Invalid selection","Punishment with the given ID doesn't exist.")
			);
		}

		const embed = {
			color: config.neutral_color,
			fields: [
				{ name: "ID", value: punishment.id.toString() },
				{ name: "Action", value: punishment.action },
				{
					name: "Target User",
					value: `${punishment.targetUserTag}(<@${punishment.targetUserId}>) [**ID:** ${punishment.targetUserId}]`,
				},
				{
					name: "Executed User",
					value: `${punishment.executedUserTag}(<@${punishment.executedUserId}>) [**ID:** ${punishment.executedUserId}]`,
				},
				{
					name: "Date",
					value: `<t:${Math.floor(punishment.createdAt.getTime() / 1000)}:F>`,
				},
			],
		};

		if (punishment.action === "warn") {
			embed.fields.push({
				name: "Valid Until",
				value: `<t:${Math.floor(punishment.validUntil.getTime() / 1000)}:F>`,
			});
		}

		embed.fields.push({
			name: "Status",
			value: punishment.status,
		});

		await interaction.editReply({
			embeds: [embed],
		});
	},
};
