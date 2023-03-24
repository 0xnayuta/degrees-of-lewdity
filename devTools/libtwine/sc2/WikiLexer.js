"use strict";
/*
 * Created by aimozg on 02.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiLexer = void 0;
// Based on
// https://github.com/tmedwards/sugarcube-2/blob/master/src/markup/parserlib.js
// https://github.com/tmedwards/sugarcube-2/blob/master/src/markup/wikifier.js
// Tweego is (c) Thomas Michael Edwards
const AbstractLexer_js_1 = require("../AbstractLexer.js");
const parserlib_js_1 = require("./parserlib.js");
const tokens_js_1 = require("./tokens.js");
class WikiLexer extends AbstractLexer_js_1.AbstractLexer {
    static RawContainerMacros = ["script", "style"];
    constructor(input, options) {
        super(WikiLexer.prototype.lexPlainText, input, options?.inputName ?? "<unknown>", options?.line ?? 1);
        this.defaultState = this.lexPlainText;
        this.rawContainerMacros = WikiLexer.RawContainerMacros.concat(options?.rawContainerMacros ?? []);
    }
    /** macro names for which only minimum processing should happen */
    rawContainerMacros;
    *lexPlainText() {
        let match = this.match(parserlib_js_1.AllParsersRegex);
        if (!match) {
            if (this.gotoEnd()) {
                yield this.token(tokens_js_1.WikiTokenType.Text);
            }
            this.state = null;
            return;
        }
        // found something
        this.pos = match.index;
        if (this.pos > this.start) {
            yield this.token(tokens_js_1.WikiTokenType.Text);
        }
        let index = match.findIndex((x, i) => i > 0 && x) - 1;
        if (!(index in parserlib_js_1.ParserLib))
            this.error(`unexpected WikiLexer match #${index} ${JSON.stringify(match[0])}`);
        this.state = parserlib_js_1.ParserLib[index].handler;
    }
}
exports.WikiLexer = WikiLexer;
//# sourceMappingURL=WikiLexer.js.map