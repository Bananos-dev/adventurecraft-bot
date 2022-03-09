const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
	name: "ip",
	description: "Displays the IP of AdventureCraft.",
	/**
	 *
	 * @param {CommandInteraction} interaction
	 */
	async execute(interaction, client) {
		await interaction.deferReply();

		const pingEmbed = new MessageEmbed()
			.setColor(config.neutral_color)
			.setTitle(config.minecraft_server_domain)
			.addFields({
				name: "How to connect",
				value: `**1:** Open Minecraft 1.18.1 and click on "multiplayer".
            **2:** Click on "Direct Connection".
            **3:** Paste "${config.minecraft_server_domain}" into the text field.
            **4:** Click on "Join Server".`,
			})
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
