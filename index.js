const { Client, Collection, Intents } = require("discord.js");
const client = new Client({
	intents: [Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILDS],
	partials: ["GUILD_MEMBER"],
});
const config = require("./config.json");
const ping = require("ping");
const interactionCreate = require("./Events/Interaction/interactionCreate");

client.commands = new Collection();
require("./Handlers/events")(client);
require("./Handlers/commands")(client);
require("./Functions/filter")(client);

client.login(config.token);
