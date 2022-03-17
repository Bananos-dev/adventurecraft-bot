const config = require("../config.json");

async function postLog(
	guild,
	executedMember,
	targetMember,
	action,
	reasonOrNote,
	id
) {
	const embed = {
		title: "Log Entry",
		color: config.neutral_color,
		fields: [
			{ name: "Action", value: action },
			{
				name: "Member",
				value: `${targetMember.user.tag} (${targetMember.user.toString()})`,
			},
			{
				name: "Executed By",
				value: `${executedMember.user.tag} (${executedMember.user.toString()})`,
			},
		],
	};

	if (action !== "Note") {
		embed.fields.push({
			name: "Reason",
			value: reasonOrNote,
		});
	} else {
		embed.fields.push({
			name: "Note",
			value: reasonOrNote,
		});
	}

	if (id) {
		embed.fields = [{ name: "ID", value: id.toString() }, ...embed.fields];
	}

	try {
		const logChannel = await guild.channels.fetch(config.mod_log_channel_id);
		await logChannel.send({ embeds: [embed] });
	} catch (e) {
		console.log(e);
	}
}

module.exports = {
	postLog,
};
