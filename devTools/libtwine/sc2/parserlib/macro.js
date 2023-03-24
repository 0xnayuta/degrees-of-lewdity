"use strict";
/*
 * Created by aimozg on 08.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDMacro = void 0;
const patterns_js_1 = require("../../patterns.js");
const tokens_js_1 = require("../tokens.js");
const reMacro = '<<(?!<)';
const laMacro = new RegExp(`<<(/?${patterns_js_1.default.macroName})(?:\\s*)((?:(?:/\\*[^*]*\\*+(?:[^/*][^*]*\\*+)*/)|(?://.*\\n)|(?:\`(?:\\\\.|[^\`\\\\])*\`)|(?:"(?:\\\\.|[^"\\\\])*")|(?:'(?:\\\\.|[^'\\\\])*')|(?:\\[(?:[<>]?[Ii][Mm][Gg])?\\[[^\\r\\n]*?\\]\\]+)|[^>]|(?:>(?!>)))*)>>`, 'gm');
function* lexMacro() {
    let match = this.match(laMacro);
    if (match) {
        this.pos = this.nextMatch;
        let name = match[1];
        yield this.token(tokens_js_1.WikiTokenType.Macro, { name: name, args: match[2] });
        if (this.rawContainerMacros.includes(name)) {
            let closingTag = new RegExp(`<<((?:/|end)${name})>>`, 'g');
            match = this.match(closingTag);
            if (match) {
                this.pos = match.index;
                yield this.token(tokens_js_1.WikiTokenType.Text);
                this.pos = this.nextMatch;
                yield this.token(tokens_js_1.WikiTokenType.Macro, { name: match[1], args: '' });
            }
        }
    }
    else {
        this.pos = this.nextMatch;
        yield this.token(tokens_js_1.WikiTokenType.Text);
    }
}
exports.PDMacro = {
    re: reMacro,
    handler: lexMacro
};
//# sourceMappingURL=macro.js.map