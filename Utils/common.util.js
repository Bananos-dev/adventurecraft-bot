const { MessageEmbed} = require("discord.js");
const { readdir } = require("fs/promises");
const { resolve } = require("path");
const { title } = require("process");
const config = require("../config.json");

/**
 * get all files in a directory recursively
 *
 * @param {string} dirPath file directory
 * @param {string} ext file extension
 *
 */
async function getDirFiles(dirPath, ext) {
	const dirents = await readdir(dirPath, { withFileTypes: true });
	const files = await Promise.all(
		dirents.map((dirent) => {
			const res = resolve(dirPath, dirent.name);
			return dirent.isDirectory() ? getDirFiles(res, ext) : res;
		})
	);
	return Array.prototype.concat(...files).filter((f) => f.endsWith(ext));
}

function getErrorReplyContent(ttl, desc) {
	let errReplyEmbed = new MessageEmbed()
	.setColor(config.error_color)
	.setTitle(ttl)
	.setDescription(desc)
	return {
		embeds: [errReplyEmbed],
	};
}

function getSuccessReplyContent(ttl, desc) {
	let succReplyEmbed = new MessageEmbed()
	.setColor(config.neutral_color)
	.setTitle(ttl)
	.setDescription(desc)
	return {
		embeds: [succReplyEmbed],
	};
}

function getMilliseconds(duration, unit) {
	switch (unit) {
		case "s":
			return duration * 1000;
		case "m":
			return duration * 60000;
		case "h":
			return duration * 3.6e6;
		case "d":
			return duration * 8.64e7;
		case "w":
			return duration * 6.048e8;
	}
}

function sendError(error) {
	let functionErrorEmbed = new MessageEmbed()
	.setColor(config.error_color)
	.setTitle("New error")
	.setDescription(`${error}`)

	return client.channels.cache.get(config.mod_log_channel_id).send({content: `<@602150578935562250><@538108898733981698> New error`, embeds: [functionErrorEmbed] });
}

module.exports = {
	getDirFiles,
	getErrorReplyContent,
	getSuccessReplyContent,
	sendError,
};
