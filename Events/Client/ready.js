const { Client } = require("discord.js");
const mongoose = require("mongoose");
const config = require("../../config.json");

module.exports = {
    name: "ready",
    once: true,
    /**
 * @param {Client} client
 */
    async execute(client) {
        console.log("The client is now ready.");
        client.user.setActivity("AdventureCraft", {type: "PLAYING"});

        mongoose.connect(`${config.mongodb_uri}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {
            console.log("Successfully connected to the database!");
        });
    }
}