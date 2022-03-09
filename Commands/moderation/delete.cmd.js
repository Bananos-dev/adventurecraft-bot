const { Constants, CommandInteraction } = require("discord.js");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");

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
		await interaction.deferReply({ ephemeral: true });

		const executedMember = await interaction.guild.members.fetch(
			interaction.user
		);

		if (!executedMember.permissions.has("ADMINISTRATOR")) {
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

		await memberPunishmentSchema.deleteOne({ id: id });

		await interaction.editReply(
			getSuccessReplyContent(`Punishment with the id ${id} has been deleted.`)
		);
	},
};
