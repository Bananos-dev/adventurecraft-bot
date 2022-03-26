const { Client } = require("discord.js");
const { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
const config = require("../config.json");
const { getDirFiles } = require("../Utils/common.util");
/**
 * @param { Client } client
 */

module.exports = async (client) => {
	const Table = new Ascii("Commands loaded");

	CommandsArray = [];

	(await getDirFiles(`${process.cwd()}/Commands`, ".cmd.js")).map(
		async (file) => {
			const command = require(file);


			if (!command.name && command.description) {
				Table.addRow(file.split("/")[7], "🔴 FAILED", "Missing a name.");
			} else if (!command.description && command.name) {
				Table.addRow(file.split("/")[7], "🔴 FAILED", "Missing a description.");
			} else if (!command.name && !command.description) {
				Table.addRow(
					file.split("/")[7],
					"🔴 FAILED",
					"Missing a name and description."
				);
			}

			client.commands.set(command.name, command);
			CommandsArray.push(command);

			await Table.addRow(command.name, "🟢 SUCCESSFUL");
		}
	);

	console.log(Table.toString());

	client.on("ready", async () => {
		const server = await client.guilds.cache.get(config.guild_id);
		server.commands.set(CommandsArray);
	});
};
