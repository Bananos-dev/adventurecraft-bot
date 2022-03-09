const { Client, Collection } = require("discord.js");
const client = new Client({intents: 4615});
const config = require("./config.json");
const ping = require("ping");
const interactionCreate = require("./Events/Interaction/interactionCreate");

client.commands = new Collection();
require("./Handlers/events")(client);
require("./Handlers/commands")(client);
require("./Functions/filter")(client);

client.login(config.token);