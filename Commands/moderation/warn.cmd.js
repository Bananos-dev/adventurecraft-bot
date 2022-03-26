const { Constants, CommandInteraction, MessageEmbed } = require("discord.js");
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
		await interaction.deferReply({ ephemeral: false });

		let executedMember = await interaction.guild.members.fetch(
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
					"Invalid selection", "The member you mentioned does not exist."
				)
			);
		}

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

		const warnings = await memberPunishmentSchema.find({
			targetUserId: user.id,
			status: "active",
		});

		const DMmsg = new MessageEmbed()
		.setColor(config.neutral_color)
		.setTitle("Punishment updated")
		.addFields(
			{ name: "Action", value: "Warning", inline: true},
			{ name: "Reason", value: `${reason}`, inline: true},
			{ name: "Punishment ID", value: `${record.id}`, inline: true},
		)
		.setFooter({text: `${3 - warnings.length} warnings until ban.`})

		await targetMember.user
			.send({
				embeds: [DMmsg],
			})
			.catch((_) => {});

		await interaction.editReply(
			getSuccessReplyContent("User warned", `${user.tag} has been warned for ${reason}.`
			)
		);

		// if member is not bannable or warnings is less than 3 ignore
		if (warnings.length < 3 || !targetMember.bannable) return;

		const banReason = "Accumulated three warnings.";

		await postLog(
			interaction.guild,
			interaction.guild.me,
			targetMember,
			"Ban",
			banReason,
			record.id
		);

		const DMbanMsg = new MessageEmbed()
		.setColor(config.neutral_color)
		.setTitle("Punishment updated")
		.addFields(
			{ name: "Action", value: "Ban", inline: true},
			{ name: "Reason", value: `${banReason}`, inline: true},
			{ name: "Punishment ID", value: `${record.id}`}
		)
		await targetMember.user.send({
			embeds: [DMbanMsg],
		}).catch((_) => {});

		await targetMember.ban({ reason: banReason });

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
