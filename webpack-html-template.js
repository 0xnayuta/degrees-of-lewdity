/*
 * Created by aimozg on 27.02.2023.
 */
const generateTwineHtml = require("./devTools/webpack/html-template-generator.js");

module.exports = function (templateParams) {
	const htmlWebpackPlugin = templateParams.htmlWebpackPlugin;
	return generateTwineHtml({
		storyFormatFile: "devTools/tweego/storyFormats/sugarcube-2/format.js",
		// storyFormatPrefix: "window.storyFormat(",
		// storyFormatSuffix: ");",

		head: [
			`<link type="image/png" rel="icon" sizes="16x16" href="${require("./devTools/favicon.png")}" />`,
			`<meta name="color-scheme" content="light dark"/>`,
		],

		// Import modules from ~/modules/
		// This statement is processed by webpack, its arguments MUST be literals,
		// so it's impossible to pass "./modules/" as an option to the generateTwineHtml function
		modules: require.context("./modules/", true, /\.(css|js)$/),

		// Import all Twee, CSS, JS, and font files from ~/game/
		passages: require.context("./game/", true, /\.(twee|js|css|ttf)$/),

		// Embed as userscripts all generated JS assets (that would be just "index.js")
		// Add them before userscripts from game/**/*.js
		userscriptsPos: "before",
		userscripts: [
			...htmlWebpackPlugin.files.js.map(file => templateParams.compilation.assets[file.substring(htmlWebpackPlugin.files.publicPath.length)].source()),
		],
	});
};
