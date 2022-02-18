const { Client } = require("discord.js");
const  { promisify } = require("util");
const { glob } = require("glob");
const PG = promisify(glob);
const Ascii = require("ascii-table");
/**
 * @param { Client } client
 */

module.exports = async client => {
    const Table = new Ascii("Commands loaded");

   CommandsArray = [];

    (await PG(`${process.cwd()}/Commands/*/*.js`)).map(async (file) => {
        const command = require(file);

        client.commands.set(command.name, command);
        CommandsArray.push(command);

        await Table.addRow(command.name, "🟢 SUCCESSFUL");
    });
    console.log(Table.toString());
};