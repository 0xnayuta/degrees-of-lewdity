/**
 * An **intermediate** Webpack loader that converts Twee files to PassageEntry sequences.
 *
 * Created by aimozg on 02.10.2022.
 */

let {parsePassages} = require( "../libtwine/twee/TweeParser.js");

module.exports = function (source) {
	// Example 1 - parse tokens and return (to debug-loader)
	/*let lexer = new TweeLexer(source, this.resourcePath);
	let tokens = lexer.collect();

	// convert Symbols to strings
	for (let token of tokens) token.type = token.type.description;
	return tokens;*/

	// Example 2 - parse passages and return (to debug-loader)
	/*return parsePassages(source, this.resourcePath).map(passage => ({
		type: 'wiki',
		name: passage.name,
		line: passage.line,
		tags: passage.tags,
		content: new WikiLexer(source, this.resourcePath+"::"+passage.name).collect()
	}));*/

	return parsePassages(source, this.resourcePath);
}
