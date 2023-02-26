"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDLineBreak = void 0;
const tokens_js_1 = require("../tokens.js");
const reLineBreak = '\\n|<[Bb][Rr]\\s*/?>';
function* lexLinebreak() {
    this.pos = this.nextMatch;
    yield this.token(tokens_js_1.WikiTokenType.LineBreak);
    this.state = this.lexPlainText;
}
exports.PDLineBreak = {
    re: reLineBreak,
    handler: lexLinebreak
};
//# sourceMappingURL=line-break.js.map