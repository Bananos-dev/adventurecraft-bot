const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { execute } = require("../Events/Client/ready");
const config = require("../config.json");

module.exports = {
	name: "ping",
	description: "Displays the bot's latency.",
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const pingEmbed = new MessageEmbed()
			.setTitle("AdventureCraft latencies")
			.setColor(config.neutral_color)
			.setDescription(
				`**Websocket latency**: \`${
					client.ws.ping
				}ms\`\n**Client latency**: \`${
					Date.now() - interaction.createdTimestamp
				}ms\``
			)
			.setFooter({
				iconURL:
					"https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128",
				text: "Coded by Bananos #1873",
			});

		await interaction.editReply({
			embeds: [pingEmbed],
		});
	},
};
