"use strict";
/**
 * Created by aimozg on 02.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parsePassages = exports.passageSequence = exports.SpecialPassageNames = void 0;
// Based on https://github.com/tmedwards/tweego/blob/master/storyload.go
// Tweego is (c) Thomas Michael Edwards
const TweeLexer_js_1 = require("./TweeLexer.js");
exports.SpecialPassageNames = [
    "StoryIncludes",
    "StoryData",
    "StorySettings",
    "StoryTitle"
];
function newPassage(line) {
    return { type: 'passage', name: '', tags: [], text: '', special: false, line };
}
function finish(p) {
    p.special = exports.SpecialPassageNames.includes(p.name);
}
/**
 * @param input Input source
 * @param inputName Input file name (for error reporting)
 * @param trim Trim whitespace
 */
function* passageSequence(input, inputName = "<unknown>", trim = true) {
    let lexer = new TweeLexer_js_1.TweeLexer(input, inputName);
    let pCount = 0;
    let passage = newPassage(lexer.line);
    let lastType = TweeLexer_js_1.TweeTokenType.EOF;
    for (let token of lexer.run()) {
        switch (token.type) {
            case TweeLexer_js_1.TweeTokenType.Error:
                lexer.error("Lexer error: " + token.val);
                break;
            case TweeLexer_js_1.TweeTokenType.EOF:
                // Add the final passage, if any
                if (pCount > 0) {
                    finish(passage);
                    yield passage;
                }
                break;
            case TweeLexer_js_1.TweeTokenType.Header:
                pCount++;
                if (pCount > 1) {
                    finish(passage);
                    yield passage;
                    passage = newPassage(token.line);
                }
                break;
            case TweeLexer_js_1.TweeTokenType.Name:
                passage.name = token.val.trim();
                if (!passage.name)
                    lexer.error(`Passage with no name`);
                break;
            case TweeLexer_js_1.TweeTokenType.Tags:
                if (lastType !== TweeLexer_js_1.TweeTokenType.Name)
                    lexer.error(`Tags must follow the passage name`);
                let raw = token.val.substring(1, token.val.length - 1).trim();
                if (raw)
                    passage.tags = raw.split(/\s+/g);
                break;
            case TweeLexer_js_1.TweeTokenType.Metadata:
                // TODO implement metadata parsing
                lexer.error("Metadata parsing not implemented (in twee-parser)");
                break;
            case TweeLexer_js_1.TweeTokenType.Content:
                passage.text = trim ? token.val.trim() : token.val;
                break;
        }
        lastType = token.type;
    }
}
exports.passageSequence = passageSequence;
/**
 * @param input Input source
 * @param inputName Input file name (for error reporting)
 * @param trim Trim whitespace
 */
function parsePassages(input, inputName = "<unknown>", trim = true) {
    return [...passageSequence(input, inputName, trim)];
}
exports.parsePassages = parsePassages;
//# sourceMappingURL=TweeParser.js.map