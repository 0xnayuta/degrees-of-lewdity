/** @type {import('postcss-load-config').Config} */
module.exports = {
	parser: require("postcss-safe-parser"),
	plugins: [require("postcss-preset-env")],
};
