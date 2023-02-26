/*
 * Created by aimozg on 20.02.2023.
 */

const fs = require("fs");
const path = require("path");

function escapeXml(n) {
	return String(n).replace(/[&<>'"]/g, (s)=>{
		if (s === '&') return '&amp;'
		else if (s === '<') return '&lt;';
		else if (s === '>') return '&gt;';
		else if (s === '\'') return '&#39;';
		else if (s === '"') return '&quot;';
		return s;
	});
}

function slugify(s) {
	return s.replace(/[\x00-\x20!-\/:-@[-^\x60{-\x9f]+/g,'_');
}

/**
 * @param {webpack.Context} context A require.context(...) expression
 * @return {[string,any][]} Array of `[filename, content]` entries
 */
function webpackImportContext(context) {
	return context.keys().sort().map(filename=>[filename, context(filename)]);
}

/**
 *
 * @param storyFormatFile Path to the story format file.
 * @param {Object} options Options
 * @param {string} [options.jsonPrefix="window.storyFormat("] String before JSON starts in file
 * @param {string} [options.jsonSuffix=");"] String after JSON ends in file
 * @return {Object} Parsed story format JSON
 */
function importStoryFormat(storyFormatFile, options={}) {
	let jsonPrefix = options.jsonPrefix ?? "window.storyFormat(";
	let jsonSuffix = options.jsonPrefix ?? ");";
	let storyFormatString = fs.readFileSync(storyFormatFile).toString();
	storyFormatString = storyFormatString.substring(
		jsonPrefix.length,
		storyFormatString.length - jsonSuffix.length);
	let storyFormatObject = JSON.parse(storyFormatString);
	return storyFormatObject
}

/**
 * @param {Object} params
 * @param {string} params.storyFormatFile Path to the story format file
 * @param {string} [params.storyFormatPrefix="window.storyFormat("] String before JSON starts in story format file
 * @param {string} [params.storyFormatSuffix=");"] String after JSON ends in story format file
 * @param {string[]} [params.head] Extra content to inject before </head>
 * @param {webpack.Context} [params.modules] JS and CSS modules to include. This should be a Webpack require.context(...) expression.
 * @param {webpack.Context} params.passages Passage files (twee, js, css, fonts). This should be a Webpack require.context(...) expression.
 * @param {string[]} [params.userscripts] Additional userscripts to include.
 * @param {"before"|"after"} [params.userscriptsPos="after"] Where to add params.userscripts - before script passages or after.
 */
function generateTwineHtml(params) {

	let storyFormatObject = importStoryFormat(params.storyFormatFile);
	let html = storyFormatObject.source;

	let modules = []; // Array of "<script>" and "<style>" strings
	let passages = []; // Array of "<tw-passagedata>" strings
	let userscripts = []; // Array of JS chunks
	let userstyles = []; // Array of CSS chunks
	let story = { // Story metadata, picked from StoryData and StoryTitle passages
		ifid: "",
		title: "Untitled Story",
		creator: "libtwee",
		creatorVersion: "0.1.0",
		zoom: 1,
		startNode: -1,
		startName: "Start",
		format: storyFormatObject.name,
		formatVersion: storyFormatObject.version,
		options: []
	}
	let appendHead = ""; // Content to inject before </head>

	// Include head.html
	if (Array.isArray(params.head)) appendHead += params.head.join("\n");

	if (params.modules) {
		for (let [filename, content] of webpackImportContext(params.modules)) {
			if (filename.match(/\.css$/)) {
				modules.push(`<style id="style-module-${(slugify(path.basename(filename, '.css')))}" type="text/css">${content.trim()}</style>`);
			} else if (filename.match(/\.js$/)) {
				modules.push(`<script id="script-module-${(slugify(path.basename(filename, '.js')))}" type="text/javascript">${content.trim()}</script>`)
			}
		}
	}

	// Import all Twee, CSS and JS files from ~/game/
	let pid = 1, scriptno = 1, styleno = 1;
	let passageNameToId = {};

	function createUserScript(filename, content) {
		return `/* twine-user-script #${scriptno++}: "${path.basename(filename)}" */\n${content.trim()}`;
	}

	function addUserStyle(filename, content) {
		userstyles.push(`/* twine-user-stylesheet #${styleno++}: "${path.basename(filename)}" */\n${content.trim()}`)
	}
	function addNormalPassage(passage) {
		// TODO use passage metadata?
		let x = pid%10;
		let y = Math.floor(pid/10);
		if (x === 0) x = 10; else y++;
		x = x*125-25;
		y = y*125-25;
		passageNameToId[passage.name] = pid;
		passages.push(`<tw-passagedata` +
			` pid="${pid}"` +
			` name="${escapeXml(passage.name)}"` +
			` tags="${escapeXml(passage.tags.join(" "))}"`+
			` position="${x},${y}"`+
			` size="100,100">` +
			escapeXml(passage.text) +
			`</tw-passagedata>`);
		pid++
	}
	for (let [filename, content] of webpackImportContext(params.passages)) {
		let extension = path.extname(filename);
		switch (extension) {
			case ".js":
				userscripts.push(createUserScript(filename, content));
				break;
			case ".css":
				addUserStyle(filename, content);
				break;
			case ".ttf":
			case ".otf": {
				let fontFamily = path.basename(filename).split(".")[0];
				let fontFormat = (extension === ".ttf") ? "truetype" : "opentype";
				addUserStyle(filename, `@font-face {
\tfont-family: "${fontFamily}";
\tsrc: url("${content}") format("${fontFormat}");
}`);
				break;
			}
			case ".twee":
				for (let passage of content) {
					if (passage.special) {
						if (passage.name === 'StoryTitle') {
							story.title = passage.text;
						} else if (passage.name === 'StoryData') {
							let settings = JSON.parse(passage.text);
							story.ifid = settings.ifid;
							story.format = settings.format ?? story.format;
							story.formatVersion = settings["format-version"] ?? story.formatVersion;
							story.zoom = settings.zoom ?? story.zoom;
							story.startName = settings.start ?? story.startName;
						}
					} else if (passage.tags.includes("script")) {
						userscripts.push(createUserScript(filename, content));
					} else if (passage.tags.includes("style")) {
						addUserStyle(filename, content);
					} else {
						addNormalPassage(passage);
					}
				}
				break;
			default:
				throw new Error(`generateTwineHtml.params.passages includes unsupported '${extension}' file '${filename}'`);
		}
	}
	story.startNode = passageNameToId[story.startName];

	if (params.userscripts) {
		let extraUserScripts = params.userscripts.map(userscript=>createUserScript("unknown.js",userscript));
		if (params.userscriptsPos === "before") {
			userscripts.unshift(...extraUserScripts);
		} else {
			userscripts.push(...extraUserScripts);
		}
	}

	appendHead = modules.join("\n")+"\n"+appendHead;
	let storyData = `<!-- UUID://${story.ifid}// -->`+
		`<tw-storydata`+
		` name="${escapeXml(story.title)}"`+
		` startnode="${escapeXml(story.startNode)}"`+
		` creator="${escapeXml(story.creator)}"`+
		` creator-version="${escapeXml(story.creatorVersion)}"`+
		` ifid="${escapeXml(story.ifid)}"`+
		` zoom="${escapeXml(story.zoom)}"`+
		` format="${escapeXml(story.format)}"`+
		` format-version="${escapeXml(story.formatVersion)}"`+
		` options="${escapeXml(story.options.join(' '))}"`+
		` hidden>`;
	if (userstyles.length > 0) {
		storyData +=
			`<style role="stylesheet" type="twine-user-stylesheet" type="text/twine-css">` +
			userstyles.join("\n") +
			`</style>`;
	}
	if (userscripts.length > 0) {
		storyData +=
			`<script role="script" type="twine-user-script" type="text/twine-javascript">` +
			userscripts.join("\n") +
			`\n</script>`;
	}
	storyData += passages.join('');
	storyData += `</tw-storydata>`;

	// We use ()=>replacement expression to avoid processing of $-sequences in the replacement string
	html = html
		.replace(/<\/head>/, ()=>appendHead.trim()+"</head>")
		.replace(/\{\{STORY_NAME}}/g, ()=>story.title)
		.replace(/\{\{STORY_DATA}}/g, ()=>storyData);

	return html
}

module.exports = generateTwineHtml;
