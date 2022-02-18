const { Client, Collection } = require("discord.js");
const client = new Client({intents: 4615});
const config = require("./config.json");

client.commands = new Collection();
require("./Handlers/events")(client);
require("./Handlers/commands")(client);

client.login(config.token);