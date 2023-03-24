"use strict";
/*
 * Created by aimozg on 08.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wikiWriteAll = exports.wikiWrite = void 0;
function wikiWrite(content, deep = true) {
    switch (content.type) {
        case "text":
            return content.text;
        case "macro": {
            let s = '<<' + content.name + (content.argString ? ' ' + content.argString : '') + '>>';
            if (deep && content.body)
                return s + wikiWriteAll(content.body) + '<</' + content.name + '>>';
            return s;
        }
        case "var":
            return content.expr;
        case "comment":
            switch (content.subtype) {
                case "/*":
                    return "/*" + content.text + "*/";
                case "/%":
                    return "/%" + content.text + "%/";
                case "<!--":
                    return "<!--" + content.text + "-->";
                default:
                    throw new Error("Bad content " + JSON.stringify(content));
            }
        case "entity":
            return content.val;
        case "html": {
            let s = '<' + content.name;
            for (let [k, v] of content.attrs) {
                s += ' ' + k;
                if (v) {
                    s += '=';
                    if (v.includes('"'))
                        s += "'" + v + "'";
                    else
                        s += '"' + v + '"';
                }
            }
            if (content.single) {
                s += '/>';
            }
            else {
                s += '>';
                if (deep)
                    s += wikiWriteAll(content.body);
                s += '</' + content.name + '>';
            }
            return s;
        }
    }
}
exports.wikiWrite = wikiWrite;
function wikiWriteAll(content) {
    return content.map(c => wikiWrite(c)).join('');
}
exports.wikiWriteAll = wikiWriteAll;
//# sourceMappingURL=WikiWriter.js.map