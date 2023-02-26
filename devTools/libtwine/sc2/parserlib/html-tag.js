"use strict";
/*
 * Created by aimozg on 08.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDHtmlTag = void 0;
const patterns_js_1 = require("../../patterns.js");
const tokens_js_1 = require("../tokens.js");
const reHtmlTag = `</?${patterns_js_1.default.htmlTagName}(?:\\s+[^\\u0000-\\u001F\\u007F-\\u009F\\s"'>\\/=]+(?:\\s*=\\s*(?:"[^"]*?"|'[^']*?'|[^\\s"'=<>\`]+))?)*\\s*\\/?>`;
function* lexHtmlTag() {
    this.pos = this.nextMatch;
    const matchText = this.input.slice(this.start, this.nextMatch);
    // "</tag>" => single "</tag>" token
    const closingTagRe = new RegExp(`^</(${patterns_js_1.default.htmlTagName})\s*>`);
    let tagMatch = closingTagRe.exec(matchText);
    if (tagMatch) {
        let tagName = tagMatch[1].toLowerCase();
        yield this.token(tokens_js_1.WikiTokenType.HtmlTagClose, { name: tagName });
        this.state = this.lexPlainText;
        return;
    }
    // "<tag attrs>" => "<tag" token, ...attrs tokens, ">" (or "/>") token
    const tagRe = new RegExp(`^<(${patterns_js_1.default.htmlTagName})`);
    tagMatch = tagRe.exec(matchText);
    if (!tagMatch) {
        this.warn("Malformed HTML tag " + JSON.stringify(matchText));
        yield this.token(tokens_js_1.WikiTokenType.Text);
        this.state = this.lexPlainText;
        return;
    }
    const isSingle = matchText.endsWith("/>");
    // Tag start
    const tag = tagMatch[1];
    const tagName = tag && tag.toLowerCase();
    yield this.token(tokens_js_1.WikiTokenType.HtmlTagStart, { name: tagName });
    // Tag attrs
    const attrText = matchText.substring(tagMatch[0].length, matchText.length - (isSingle ? 2 : 1));
    const reAttr = /([^\u0000-\u001F\u007F-\u009F\s"'>\/=]+)(?:\s*=\s*("[^"]*?"|'[^']*?'|[^\s"'=<>`]+))?/g;
    for (let attr of attrText.matchAll(reAttr)) {
        let attrValue = attr[2] ?? "";
        if (attrValue[0] === '"' || attrValue[0] === "'")
            attrValue = attrValue.substring(1, attrValue.length - 1);
        yield this.token(tokens_js_1.WikiTokenType.HtmlTagAttr, { name: attr[1], value: attrValue ?? "" });
    }
    // Tag end
    yield this.token(tokens_js_1.WikiTokenType.HtmlTagEnd, { single: isSingle });
    this.state = this.lexPlainText;
}
exports.PDHtmlTag = {
    re: reHtmlTag,
    handler: lexHtmlTag
};
//# sourceMappingURL=html-tag.js.map