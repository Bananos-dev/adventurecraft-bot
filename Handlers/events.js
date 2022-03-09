const { promisify } = require("util");
const { glob } = require("glob");
const { table } = require("console");
const PG = promisify(glob);

module.exports = async (client) => {
	(await PG(`${process.cwd()}/Events/*/*.js`)).map(async (file) => {
		const event = require(file);

		if (event.once) {
			client.once(event.name, (...args) =>
				event.execute(...args, client).catch(console.warn)
			);
		} else {
			client.on(event.name, (...args) =>
				event.execute(...args, client).catch(console.warn)
			);
		}
	});
};
