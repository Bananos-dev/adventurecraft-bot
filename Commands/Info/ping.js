const { CommandInteraction } = require("discord.js");
const { execute } = require("../../Events/Client/ready");

module.exports = {
    name: "ping",
    description: "Shows the bot's latency.",
/**
 * 
 * @param {CommandInteraction} interaction 
 */
    async execute(interaction) {
        interaction.reply({
            content: "pong",
        })
    }
}