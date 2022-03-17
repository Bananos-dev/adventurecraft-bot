const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const config = require("../config.json");
require("../Events/Client/ready.js");

module.exports = {
	name: "source",
	description: "Shows the GitHub repo of the bot",

	/**
	 *
	 * @param {CommandInteraction} interaction
	 * @param {Client} client
	 */

	async execute(interaction, client) {
	    await interaction.deferReply();

        let embed = new MessageEmbed()
        .setColor(config.neutral_color)
        .setTitle("Source of AC")
        .setDescription("This bot is open-source and can be found on this GitHub repo:\n\`https://github.com/Bananos-dev/adventurecraft-bot\`")

        interaction.editReply({embeds: [embed]});
    }
}
