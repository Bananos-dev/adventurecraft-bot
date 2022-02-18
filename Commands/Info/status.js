const { CommandInteraction, Client, MessageEmbed } = require("discord.js");
const { connection } = require("mongoose");
const ping = require("ping");
const config = require("../../config.json");
require("../../Events/Client/ready.js");

module.exports = {
    name: "status",
    description: "Displays the status of the client and database connection.",

    /**
     * 
     * @param {CommandInteraction} interaction 
     * @param {Client} client 
     */
    
    async execute(interaction, client) {
        let MCserverStatus = "\`⚫ UNKNOWN\`";
        let WebServerStatus = "\`⚫ UNKNOWN\`";

        let MCstartTime = performance.now()
        await ping.promise.probe(config.minecraft_server_ip).then(function (MCres) {
            //console.log(res);
            if(MCres.alive === true) {
                MCserverStatus = "\`🟢 ONLINE\`";
            } else if(MCres.alive === false) {
                MCserverStatus = "\`🔴 OFFLINE\`";
            } else {
                MCserverStatus = "\`⚫ UNKNOWN\`";
            }
        }); let MCendTime = performance.now();

        let WebStartTime = performance.now()
        await ping.promise.probe(config.minecraft_server_ip).then(function (WebRes) {
            //console.log(res);
            if(WebRes.alive === true) {
                WebServerStatus = "\`🟢 ONLINE\`";
            } else if(WebRes.alive === false) {
                WebServerStatus = "\`🔴 OFFLINE\`";
            } else {
                WebServerStatus = "\`⚫ UNKNOWN\`";
            }
        }); let WebEndTime = performance.now();

        let MCping = MCendTime - MCstartTime;
        let WebPing = WebEndTime - WebStartTime;

        const statusEmbed = new MessageEmbed()
            .setColor(config.neutral_color)
            .setTitle("Status")
            .setDescription(`
 
                **Discord bot**: \`🟢 ONLINE\` - \`${client.ws.ping}ms\`
                **Minecraft server**: ${MCserverStatus} - \`${parseInt(MCping)}ms\`
                **Website**: ${WebServerStatus} - \`${parseInt(WebPing)}ms\`
                \n**Database**: \`${switchTo(connection.readyState)}\`
           
            `)
            .setFooter("Coded by Bananos#1874");


            interaction.reply({
                embeds: [statusEmbed]
            });
    }
}

function switchTo(val) {
    var status = " ";
    switch(val) {
        case 0: status = "🔴 NOT CONNECTED"
        break;
    case 1: status = "🟢 CONNECTED"
        break;
    case 2: status = "🟡 CONNECTING"
        break;
    case 3: status = "🟠 DISCONNECTING"
        break;
    default: status = "⚫ UNKNOWN"
        break;
    }

    return status;
}