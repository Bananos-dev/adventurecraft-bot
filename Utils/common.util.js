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

module.exports = {
	getDirFiles,
};
