const { Client, CommandInteraction, MessageEmbed,  } = require("discord.js");
const config = require("../../config.json");
const commands = require("../../Handlers/commands");

module.exports = {
    name: "interactionCreate",
    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {
        if(interaction.isCommand()) {
            const command = client.commands.get(interaction.commandName);

            command.execute(interaction, client);
        }
    }
}