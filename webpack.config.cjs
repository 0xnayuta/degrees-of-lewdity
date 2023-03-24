"use strict";

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = env => {
	const mode = env.production ? "production" : "development";
	const watch = !env.production;
	const target = "web";
	const context = path.resolve(__dirname, "src");
	// TODO configure change devtool

	return {
		mode,
		watch,
		target,
		context,
		entry: {
			index: "./index.ts",
		},
		output: {
			// The generated JS is picked by HtmlWebpackPlugin's template and inlined
			// We don't actually need the file
			// TODO instead of writing tile to temp directory, check https://github.com/medfreeman/ignore-assets-webpack-plugin/
			path: path.resolve(__dirname, "tmp"),
			filename: "compiled.js",
		},
		resolve: {
			extensions: [".ts", ".js", ".twee"],
		},
		plugins: [
			new HtmlWebpackPlugin({
				// TODO output HTML file name
				filename: path.resolve(__dirname, "Degrees of Lewdity X.html"),
				template: path.resolve(__dirname, "webpack-html-template.js"),
				// Do not add <script src>, injection is handled by template
				inject: false,
			}),
		],
		module: {
			rules: [
				{
					test: /\.ts$/,
					exclude: /node_modules/,
					use: "ts-loader",
				},
				{
					// Do not process JS and CSS under game/ and modules/, emit them as plain text
					test: /\.(js|css)$/,
					include: [path.join(__dirname, "game"), path.join(__dirname, "modules")],
					type: "asset/source",
				},
				{
					// Emit fonts as base64
					test: /\.(ttf|otf)$/,
					type: "asset/inline",
				},
				{
					// Emit images as base64
					test: /\.(png|gif)$/,
					type: "asset/inline",
				},
				{
					test: /\.twee$/,
					use: [
						// path.resolve(__dirname, "devTools/webpack/debug-loader.cjs"),
						// path.resolve(__dirname, "devTools/webpack/twee-injector-loader.cjs"),
						// path.resolve(__dirname, "devTools/webpack/trace-loader.cjs"),
						// path.resolve(__dirname, "devTools/webpack/widget-compiler-loader.cjs"),
						// path.resolve(__dirname, "devTools/webpack/trace-loader.cjs"),
						path.resolve(__dirname, "devTools/webpack/tostring-loader.js"),
						// path.resolve(__dirname, "devTools/webpack/tw-passagedata-loader.js"),
						path.resolve(__dirname, "devTools/webpack/twee-loader.js"),
					],
				},
			],
		},
	};
};
