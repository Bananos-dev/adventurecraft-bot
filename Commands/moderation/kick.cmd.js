const { Constants, CommandInteraction, MessageEmbed } = require("discord.js");
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

		if (!targetMember.bannable) {
			return await interaction.editReply(
				getErrorReplyContent("Invalid selection","This member can't be kicked.")
			);
		}

		const record = await memberPunishmentSchema.create({
			action: "kick",
			executedUserId: executedMember.user.id,
			executedUserTag: executedMember.user.tag,
			targetUserId: user.id,
			targetUserTag: user.tag,
			reason: reason,
			status: "completed",
		});

		let sendEmbed = new MessageEmbed()
		.setColor(config.neutral_color)
		.setTitle("Punishment updated")
		.addFields(
			{ name: "Action", value: "Kick", inline: true},
			{ name: "Reason", value: `${reason}`, inline: true},
			{ name: "Punishment ID", value: `${record.id}`, inline: true}
		)

		await targetMember.user.send({ embeds: [sendEmbed] }).catch((_) => {});

		await targetMember.kick(reason);

		await interaction.editReply(
			getSuccessReplyContent(
				"User kicked",`Member: ${user.tag} has been kicked for ${reason}.`
			)
		);

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
