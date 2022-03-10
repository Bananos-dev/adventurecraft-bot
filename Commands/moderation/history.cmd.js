const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberPunishmentSchema = require("../../Schemas/member-punishment-schema");
const memberNoteSchema = require("../../Schemas/member-note-schema");

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

		const latestKick = await memberPunishmentSchema
			.findOne({
				targetUserId: user.id,
				action: "kick",
			})
			.sort({ createdAt: -1 });

		const latestBan = await memberPunishmentSchema
			.findOne({
				targetUserId: user.id,
				action: "ban",
			})
			.sort({ createdAt: -1 });

		const latestWarn = await memberPunishmentSchema
			.findOne({
				targetUserId: user.id,
				action: "warn",
			})
			.sort({ createdAt: -1 });

		const note = await memberNoteSchema.findOne({ targetUserId: user.id });

		const activeWarnings = await memberPunishmentSchema.find({
			targetUserId: user.id,
			status: "active",
		});

		await interaction.editReply({
			embeds: [
				{
					color: "BLURPLE",
					title: `History of ${user.tag}`,
					fields: [
						{
							name: "Warning",
							value: latestWarn
								? `<t:${Math.floor(
										latestWarn.createdAt.getTime() / 1000
								  )}:F>, ${latestWarn.id}(ID)`
								: "None",
						},
						{
							name: "Kick",
							value: latestKick
								? `<t:${Math.floor(
										latestKick.createdAt.getTime() / 1000
								  )}:F>, ${latestKick.id}(ID)`
								: "None",
						},
						{
							name: "Ban",
							value: latestBan
								? `<t:${Math.floor(latestBan.createdAt.getTime() / 1000)}:F>, ${
										latestBan.id
								  }(ID)`
								: "None",
						},
						{
							name: "Note",
							value: note ? note : "None",
						},
					],
					footer: {
						text: `${3 - activeWarnings.length} warnings until ban`,
					},
				},
			],
		});
	},
};
