const {
	Constants,
	CommandInteraction,
	MessageActionRow,
	MessageButton,
	Collection,
} = require("discord.js");
const config = require("../../config.json");
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

		const punishments = await memberPunishmentSchema
			.find({
				targetUserId: user.id,
			})
			.sort({ createdAt: -1 });

		if (punishments.length === 0) {
			return interaction.editReply(
				getSuccessReplyContent("This member doesn't have a history.")
			);
		}

		const note = await memberNoteSchema.findOne({ targetUserId: user.id });

		const activeWarnings = await memberPunishmentSchema.find({
			targetUserId: user.id,
			status: "active",
		});

		const getTemplateEmbed = () => {
			return {
				color: config.neutral_color,
				title: `History of ${user.tag}`,
				fields: [],
				footer: {
					text: `${3 - activeWarnings.length} warnings until ban`,
				},
			};
		};

		const embeds = [getTemplateEmbed()];

		let currentIndex = 0;

		punishments.forEach((p) => {
			if (embeds[currentIndex].fields.length == 3) {
				if (note) {
					embeds[currentIndex].fields.push({ name: "Note", value: note.note });
				}
				currentIndex++;
				embeds[currentIndex] = getTemplateEmbed();
			}

			embeds[currentIndex].fields.push({
				name: getPunishmentName(p.action),
				value: `<t:${Math.floor(p.createdAt.getTime() / 1000)}:F>, ${p.id}(ID)`,
			});
		});

		if (embeds.length == 1) {
			return interaction.editReply({ embeds });
		}

		// has more than 1 embed
		// build contents array for pagination

		const contents = embeds.map((e, i) => {
			e.title += ` | Page ${i + 1}`;

			if (i === 0) {
				return {
					embeds: [e],
					components: [
						new MessageActionRow().addComponents([
							new MessageButton()
								.setStyle("PRIMARY")
								.setCustomId(`${interaction.user.id}-history-next`)
								.setLabel("▶"),
						]),
					],
				};
			} else if (i === embeds.length - 1) {
				return {
					embeds: [e],
					components: [
						new MessageActionRow().addComponents([
							new MessageButton()
								.setStyle("PRIMARY")
								.setCustomId(`${interaction.user.id}-history-prev`)
								.setLabel("◀"),
						]),
					],
				};
			} else {
				return {
					embeds: [e],
					components: [
						new MessageActionRow().addComponents([
							new MessageButton()
								.setStyle("PRIMARY")
								.setCustomId(`${interaction.user.id}-history-prev`)
								.setLabel("◀"),
							new MessageButton()
								.setStyle("PRIMARY")
								.setCustomId(`${interaction.user.id}-history-next`)
								.setLabel("▶"),
						]),
					],
				};
			}
		});

		// initial reply
		await interaction.editReply(contents[0]);

		// button listeners
		const collector = interaction.channel.createMessageComponentCollector({
			filter: (i) => i.user.id === interaction.user.id,
			time: 600000,
		});

		let currentPage = 0;

		collector.on("collect", async (i) => {
			if (i.customId === `${interaction.user.id}-history-next`) {
				currentPage++;
				i.update(contents[currentPage]).catch((e) => {});
			}
			if (i.customId === `${interaction.user.id}-history-prev`) {
				currentPage--;
				i.update(contents[currentPage]).catch((e) => {});
			}
		});

		collector.on("end", async (_) => {
			await interaction.deleteReply().catch((e) => {});
		});
	},
};

function getPunishmentName(action) {
	switch (action) {
		case "ban":
			return "Ban";

		case "timeout":
			return "Timeout";

		case "kick":
			return "Kick";

		case "warn":
			return "Warn";
	}
}
