const { Constants, CommandInteraction, MessageEmbed } = require("discord.js");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");
const config = require("../../config.json")

module.exports = {
	name: "delete",
	description: "Delete a punishment",
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

		if (!executedMember.roles.cache.get(config.admin_role_id) || !executedMember.roles.cache.get(config.owner_role_id)) {
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
				getErrorReplyContent("Unknown ID", "Punishment with the given ID doesn't exist.")
			);
		}

		await memberPunishmentSchema.deleteOne({ id: id });

		await interaction.editReply(
			getSuccessReplyContent("Deletion sucessful", `Punishment with the id ${id} has been deleted.`)
		);

		let logEmbed = new MessageEmbed()
		.setColor(config.neutral_color)
		.setTitle("Log entry")
		.addFields(
			{ name: "ID", value: `${interaction.options.getInteger("id", true)}`},
			{ name: "Action", value: "Deletion"},
			{ name: "Executed by", value: `${interaction.user.tag} (${interaction.user.id})`}
		)

		try {
			const logChannel = await interaction.guild.channels.fetch(config.mod_log_channel_id);
			await logChannel.send({ embeds: [logEmbed] });
		} catch (e) {
			console.log(e);
		}
	},
};
