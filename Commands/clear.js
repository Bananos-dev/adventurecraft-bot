const { ContextMenuInteraction, MessageEmbed, Constants, CommandInteraction, Channel } = require("discord.js");
const moment = require("moment");
const config = require("../config.json");

module.exports = {
    name: "clear",
    description: "Clears a desired amount of messages from the chat.",
    options: [
        {
            name: "amount",
            description: "Amount of messages you want to delete",
            required: true,
            type: Constants.ApplicationCommandOptionTypes.NUMBER
        },
        {
            name: "target",
            description: "User who's messages you wish to clear",
            required: false,
            type: Constants.ApplicationCommandOptionTypes.USER
        }
    ],
    /**
     * 
     * @param {CommandInteraction} interaction 
     */
    async execute(interaction) {
        if(interaction.member.roles.cache.has(config.helper_role_id) || interaction.member.roles.cache.has(config.admin_role_id) || interaction.member.roles.cache.has(config.owner_role_id)) {
            const amount = interaction.options.getNumber("amount");
            const target = interaction.options.getMember("target");

            const messages = await interaction.channel.messages.fetch();

            if(target) {
                //Gotta work on this, can't be bothered right now
                let i = 0;
                const filtered = [];
                (await messages).filter((m) => {
                    if(m.author.id === target.id && amount > 1) {
                        filtered.push(m);
                        i++
                    }
                })
                //From here it's safe again

                await interaction.channel.bulkDelete(filtered, true).then(messages => {
                    const clearResponse = new MessageEmbed()
                    .setColor(config.success_color)
                    .setTitle("Clearing messages")
                    .setDescription(`🧹 Cleared ${amount} messages from ${target}`)
                    .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

                    interaction.reply({
                        embeds: [clearResponse ]
                    })
                });
            } else {
                await interaction.channel.bulkDelete(amount, true).then(messages => {
                    const clearResponseNoTarget = new MessageEmbed()
                    .setColor(config.success_color)
                    .setTitle("Clearing messages")
                    .setDescription(`🧹 Cleared ${amount} messages from this channel.`)
                    .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });

                    interaction.reply({
                        embeds: [clearResponseNoTarget]
                    })
                });
            }
        } else {
            const permissionsErrorEmbed = new MessageEmbed()
            .setColor(config.error_color)
            .setTitle("Missing permissions")
            .setDescription("Sorry, only staff members may execute this command.")
            .setFooter({iconURL: 'https://cdn.discordapp.com/avatars/602150578935562250/d7d011fd7adf6704bf1ddf2924380c99.png?size=128', text: "Coded by Bananos #1873" });
            interaction.reply({
                embeds: [ permissionsErrorEmbed ]
            });
        }
    }
}