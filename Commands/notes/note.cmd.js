const { Constants, CommandInteraction } = require("discord.js");
const config = require("../../config.json");
const { postLog } = require("../../Service/logs.service");
const {
	getErrorReplyContent,
	getSuccessReplyContent,
} = require("../../Utils/common.util");
const memberNoteSchema = require("../../Schemas/member-note-schema");

async function createNote(interaction) {
	const executedMember = await interaction.guild.members.fetch(
		interaction.user
	);

	if (!executedMember.roles.cache.get(config.admin_role_id || config.owner_role_id || config.helper_role_id)) {
		return interaction.editReply(
			getErrorReplyContent("Missing permissions", "Only staff may execute this command")
		)
	}

	const user = interaction.options.getUser("member", true);
	const note = interaction.options.getString("note", true);

	const targetMember = await interaction.guild.members.fetch(user);

	await interaction.editReply(
		getSuccessReplyContent(
			"Note created", `Note \`\`${note}\`\` has been created for ${user.toString()}`
		)
	);

	await memberNoteSchema.deleteMany({ targetUserId: user.id });

	await memberNoteSchema.create({
		executedUserId: executedMember.user.id,
		executedUserTag: executedMember.user.tag,
		targetUserId: user.id,
		targetUserTag: user.tag,
		note: note,
	});

	await postLog(interaction.guild, executedMember, targetMember, "Note", note);
}

async function viewNote(interaction) {
	const executedMember = await interaction.guild.members.fetch(
		interaction.user
	);

	if (!executedMember.roles.cache.get(config.admin_role_id) || !executedMember.roles.cache.get(config.owner_role_id) || !executedMember.roles.cache.get(config.helper_role_id)) {
		return interaction.editReply(
			getErrorReplyContent("Missing permissions", "Only staff may execute this command.")
		)
	}

	const user = interaction.options.getUser("member", true);

	const note = await memberNoteSchema.findOne({ targetUserId: user.id });

	if (!note) {
		return interaction.editReply(
			getSuccessReplyContent("No notes", "This user doesn't have any notes attached.")
		);
	}

	return interaction.editReply({
		embeds: [
			{
				color: "BLURPLE",
				title: "Note",
				description: note.note,
				fields: [{ name: "Created By", value: `<@${note.executedUserId}>` }],
			},
		],
	});
}

module.exports = {
	name: "note",
	description: "Create a note for a member",
	options: [
		{
			name: "create",
			description: "Create a new note",
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: "member",
					description: "member in the server",
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
				{
					name: "note",
					description: "Note to create",
					type: Constants.ApplicationCommandOptionTypes.STRING,
					required: true,
				},
			],
		},
		{
			name: "view",
			description: "View notes a member has",
			type: Constants.ApplicationCommandOptionTypes.SUB_COMMAND,
			options: [
				{
					name: "member",
					description: "member in the server",
					type: Constants.ApplicationCommandOptionTypes.USER,
					required: true,
				},
			],
		},
	],
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const subcommand = interaction.options.getSubcommand();

		switch (subcommand) {
			case "create":
				await createNote(interaction);
				break;

			case "view":
				await viewNote(interaction);
				break;
		}
	},
};
