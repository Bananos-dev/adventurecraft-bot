const { Client, Collection, MessageEmbed } = require("discord.js");
const bugreportSchema = require("./Schemas/bugreport-schema");
const client = new Client({
	intents: [4615],
});

const config = require("./config.json");
const {adminOptionsRow} = require("./Commands/bug.cmd");

client.commands = new Collection();
require("./Handlers/events")(client);
require("./Handlers/commands")(client);
require("./Functions/filter")(client);

client.on("messageCreate", async(message) => {
	if(!message.author.id === "602150578935562250") return;
        const prefix = ">";
        const args = message.content.slice(prefix.length).trim().split(/ +/);
	    const command = args.shift().toLowerCase();

        if (command === 'bugreport') {
			const bugInfo = await bugreportSchema.findOne({id: args[0],});

			if(!args[0]) return message.reply("Please enter a bug report ID.");
			if(args[1])  return message.reply("You can only check one report at once.");
			if(!bugInfo) return message.reply("Invalid ID.");

            const bugReportInfoEmbed = new MessageEmbed()
            .setColor(config.neutral_color)
            .setTitle(`Bug report #${args[0]}`)
            .addFields(
                {name: "Report ID", value: `#${args[0]}`, inline: true},
                {name: "Time", value: `<t:${bugInfo.time}:f>`},
                {name: "User ID", value: `${bugInfo.userId}`, inline: true},

                {name: "Status", value: `${checkStatus(bugInfo)}`, inline: false},
                {name: "Content of report", value: `${bugInfo.content}`, inline: false},
            )
            message.reply({embeds: [bugReportInfoEmbed]});
        }
        function checkStatus(bugInfo) {
            switch(bugInfo.status) {
                case("pending"):
                    return "\`⚪ Pending\`";
                break;
                case("review"):
                    return "\`🔵 Under review\`";
                break;
                case("accepted"):
                    return "🟢 Accepted";
                break;
                case("declined"):
                    return "\`🔴 Declined\`";
                break;
                default:
                    return "\`⚫ Unknown\`";
                break;
            }
        }
})

client.login(config.token);
