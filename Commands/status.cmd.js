const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
const config = require("../config.json");
require("../Events/Client/ready.js");

module.exports = {
	name: "status",
	description: "Displays the status of the client and database connection.",

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
		await interaction.deferReply();

		/*let MCserverStatus = "DEFAULT";
		let WebServerStatus = "DEFAULT";

		let MCstartTime = performance.now();
		await ping.promise
			.probe(config.minecraft_server_domain)
			.then(function (MCres) {
				//console.log(res);
				if (MCres.alive === true) {
					MCserverStatus = "`🟢 ONLINE`";
				} else if (MCres.alive === false) {
					MCserverStatus = "`🔴 OFFLINE`";
				} else {
					MCserverStatus = "`⚫ UNKNOWN`";
				}
			});
		let MCendTime = performance.now();

		let WebStartTime = performance.now();
		await ping.promise.probe(config.website_domain).then(function (WebRes) {
			//console.log(res);
			if (WebRes.alive === true) {
				WebServerStatus = "`🟢 ONLINE`";
			} else if (WebRes.alive === false) {
				WebServerStatus = "`🔴 OFFLINE`";
			} else {
				WebServerStatus = "`⚫ UNKNOWN`";
			}
		});
		let WebEndTime = performance.now();

		let MCping = " - " + "`" + parseInt(MCendTime - MCstartTime) + "ms`";
		let WebPing = " - " + "`" + parseInt(WebEndTime - WebStartTime) + "ms`";

		if (MCserverStatus === "`🔴 OFFLINE`") MCping = "";
		if (WebServerStatus === "`🔴 OFFLINE`") WebPing = "";

		while (WebServerStatus === "DEFAULT" && MCserverStatus === "DEFAULT") {}

		const statusEmbed = new MessageEmbed()
			.setColor(config.neutral_color)
			.setTitle("Status")
			.setDescription(
				`
 
                **Discord bot**: \`🟢 ONLINE\` - \`${client.ws.ping}ms\`
                **Minecraft server**: ${MCserverStatus} ${MCping}
                **Website**: ${WebServerStatus} ${WebPing}
                \n**Database**: \`${switchTo(connection.readyState)}\`
           
            `
			)
			.setFooter({
				iconURL:
					"https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128",
				text: "Coded by Bananos #1873",
			});

		await interaction.editReply({
			embeds: [statusEmbed],
		});*/
	},
};

function switchTo(val) {
	var status = " ";
	switch (val) {
		case 0:
			status = "🔴 NOT CONNECTED";
			break;
		case 1:
			status = "🟢 CONNECTED";
			break;
		case 2:
			status = "🟡 CONNECTING";
			break;
		case 3:
			status = "🟠 DISCONNECTING";
			break;
		default:
			status = "⚫ UNKNOWN";
			break;
	}

	return status;
}
