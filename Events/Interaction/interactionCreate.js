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
        if(interaction.isCommand() || interaction.isContextMenu()) {
            const command = client.commands.get(interaction.commandName);

            try {
                command.execute(interaction, client);
            } catch(error) {
                console.log(error)
                const commandExecutionErrorEmbed = new MessageEmbed()
                .setTitle("Error while attempting to execute a command")
                .setColor(config.error_color)
                .setDescription(error)
                .setFooter("Coded by Bananos#1874, this bot is open source: github.com/Bananos-dev/adventurecraft-bot")

                client.guilds.cache.get(config.guild_id).channels.cache.get(config.error_log_channel_id).send({
                    embeds: {
                        commandExecutionErrorEmbed
                    }
                });
            }
        }
    }
}