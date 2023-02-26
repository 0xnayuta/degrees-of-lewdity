"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDComment = void 0;
const tokens_js_1 = require("../tokens.js");
const reComment = '(?:/(?:%|\\*))|(?:<!--)';
function* lexComment() {
    const laComment = /(?:\/(%|\*)(?:(?:.|\n)*?)\1\/)|(?:<!--(?:(?:.|\n)*?)-->)/gm;
    let match = this.match(laComment);
    if (match && match.index === this.start) {
        this.pos = this.nextMatch;
        let token = this.token(tokens_js_1.WikiTokenType.Comment, { text: '' });
        if (token.val[0] === '/')
            token.text = token.val.substring(2, token.val.length - 2);
        else
            token.text = token.val.substring(4, token.val.length - 3);
        yield token;
    }
    else {
        this.warn("cannot find closing comment");
        this.pos = this.nextMatch;
    }
    this.state = this.lexPlainText;
}
exports.PDComment = {
    re: reComment,
    handler: lexComment
};
//# sourceMappingURL=comment.js.map