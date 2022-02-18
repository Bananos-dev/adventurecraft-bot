const { CommandInteraction, Client } = require("discord.js");
const { execute } = require("../../Events/Client/ready");

module.exports = {
    name: "ping",
    description: "Displays the bot's latency.",
/**
 * 
 * @param {CommandInteraction} interaction 
 */
    async execute(interaction, client) {
        interaction.reply({
            content: `Websocket latency: \`\`${client.ws.ping}ms\`\`\nclient latency: \`\`${interaction.createdTimestamp - Date.now()}ms\`\``,
        });
    }
}