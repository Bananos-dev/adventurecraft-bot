const config = require("../config.json");

async function postLog(
	guild,
	executedMember,
	targetMember,
	action,
	reasonOrNote
) {
	const embed = {
		title: "Log Entry",
		color: 0x7289da,
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
