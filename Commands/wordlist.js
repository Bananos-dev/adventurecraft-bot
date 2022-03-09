const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const config = require("../config.json");

module.exports = {
    name: "wordlist",
    description: "Shows all prohibited words in the server.",
/**
 * 
 * @param {CommandInteraction} interaction 
 */
    async execute(interaction, client) {
        const pingEmbed = new MessageEmbed()
        .setColor(config.neutral_color)
        .setTitle("List of prohibited words")
        .setDescription(`•Nigga\n•Nigger\n•Wog\n•Gypsy\n•Retard\n•Faggot\n•Fag`)
        .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });
        
        
        interaction.reply({
            embeds: [ pingEmbed ],
        });
    }
}