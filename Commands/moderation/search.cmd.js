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

		const id = interaction.options.getInteger("id", true);

		const punishment = await memberPunishmentSchema.findOne({
			id,
		});

		if (!punishment) {
			return interaction.editReply(
				getSuccessReplyContent("Punishment with the given ID doesn't exist.")
			);
		}

		const embed = {
			color: "BLURPLE",
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
