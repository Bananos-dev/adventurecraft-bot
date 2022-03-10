const { readdir } = require("fs/promises");
const { resolve } = require("path");

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

function getErrorReplyContent(text) {
	return {
		embeds: [
			{
				color: 0xff0000,
				description: text,
			},
		],
	};
}

function getSuccessReplyContent(text) {
	return {
		embeds: [
			{
				color: 0x00ff00,
				description: text,
			},
		],
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

module.exports = {
	getDirFiles,
	getErrorReplyContent,
	getSuccessReplyContent,
	getMilliseconds,
};
