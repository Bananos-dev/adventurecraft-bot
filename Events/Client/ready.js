const { Client, MessageEmbed } = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config.json");
const {
	startWarningCheckService,
} = require("../../Service/warning-check.service");

module.exports = {
	name: "ready",
	once: true,
	/**
	 * @param {Client} client
	 */
	async execute(client) {
		console.log("The client is now ready.");

		try {
			mongoose.connect(`${config.mongodb_uri}`).then(() => {
				console.log("Successfully connected to the database!");
				startWarningCheckService().catch(console.warn);
			});
		} catch (error) {
			console.warn(error);

			const mongoDBerrorEmbed = new MessageEmbed()
				.setTitle("Error while connecting to database")
				.setColor(config.error_color)
				.setDescription(error)
				.setFooter(
					"Coded by Bananos#1874, this bot is open source: github.com/Bananos-dev/adventurecraft-bot"
				);

			client.guilds.cache
				.get(config.guild_id)
				.channels.cache.get(config.error_log_channel_id)
				.send({
					embeds: {
						mongoDBerrorEmbed,
					},
				});
		}
	},
};
