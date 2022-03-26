const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

module.exports = {
	name: "ban",
	description: "Ban a member from the server",
	options: [
		{
			name: "member",
			description: "member to ban",
			type: Constants.ApplicationCommandOptionTypes.USER,
			required: true,
		},
		{
			name: "reason",
			description: "Reason for ban",
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
			
		 if (!executedMember.roles.cache.get(config.admin_role_id)) {
			return interaction.editReply(
				getErrorReplyContent("Missing permissions", "Only staff may execute this command")
			)
		}
				

		const user = interaction.options.getUser("member", true);
		const reason = interaction.options.getString("reason", true);

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

		if (!targetMember.bannable) {
			return await interaction.editReply(
				getErrorReplyContent("Hoist error", "This member can't be banned.")
			);
		}

		const record = await memberPunishmentSchema.create({
			action: "ban",
			executedUserId: executedMember.user.id,
			executedUserTag: executedMember.user.tag,
			targetUserId: user.id,
			targetUserTag: user.tag,
			reason: reason,
			status: "completed",
		});

		await targetMember.user
			.send({
				embeds: [
					{
						color: "RED",
						description: `You have been banned for **${reason}**.`,
						footer: {
							text: `Punishment ID: ${record.id}`,
						},
					},
				],
			})
			.catch((_) => {});

		await targetMember.ban({ reason: reason });

		await interaction.editReply(
			getSuccessReplyContent(
				"User banned",`Member: ${user.tag} has been banned for ${reason}.`
			)
		);

		await postLog(
			interaction.guild,
			executedMember,
			targetMember,
			"Ban",
			reason,
			record.id
		);
	},
};
