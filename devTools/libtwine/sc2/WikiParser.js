"use strict";
/*
 * Created by aimozg on 07.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiParser = void 0;
const WikiLexer_js_1 = require("./WikiLexer.js");
const utils_js_1 = require("../utils.js");
const tokens_js_1 = require("./tokens.js");
class WikiParser {
    inputName;
    static KnownContainerMacros = new Set([
        "capture",
        "script",
        "nobr",
        "silently",
        "type",
        "if",
        "for",
        "switch",
        "button",
        "cycle",
        "link",
        "linkappend",
        "linkprepend",
        "linkreplace",
        "listbox",
        "append",
        "prepend",
        "replace",
        "createaudiogroup",
        "createplaylist",
        "done",
        "repeat",
        "timed",
        "widget"
    ]);
    static VoidHtmlTags = new Set([
        'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'keygen', 'link', 'menuitem', 'meta',
        'param', 'source', 'track', 'wbr'
    ]);
    static parseAll(input, options) {
        let wikiLexer = new WikiLexer_js_1.WikiLexer(input, options);
        return new WikiParser(wikiLexer.run(), options?.inputName).parseAll();
    }
    constructor(input, inputName = "<unknown>") {
        this.inputName = inputName;
        if (Array.isArray(input))
            input = (0, utils_js_1.array2sequence)(input);
        this.input = (0, utils_js_1.observedSequence)(input, token => this.onToken(token));
    }
    input;
    last = { type: tokens_js_1.WikiTokenType.Text, val: "", pos: 0, line: 0 };
    onToken(t) {
        this.last = t;
    }
    nextOrNull() {
        let x = this.input.next();
        if (x.done === true)
            return null;
        return x.value;
    }
    next() {
        let token = this.nextOrNull();
        if (!token)
            this.error("Unexpected EOF");
        return token;
    }
    expect(type) {
        let token = this.next();
        if (token.type !== type)
            this.error(`Expected ${tokens_js_1.WikiTokenType[type]}, got ${tokens_js_1.WikiTokenType[token.type]}`);
        return token;
    }
    expectAny(...types) {
        let token = this.next();
        if (!types.includes(token.type))
            this.error(`Expected ${types.map(type => tokens_js_1.WikiTokenType[type]).join("|")}, got ${tokens_js_1.WikiTokenType[token.type]}`);
        return token;
    }
    error(msg, at) {
        let line = typeof at === "number" ? at : (at ?? this.last).line;
        throw new Error(`[${this.inputName} line ${line}]: ${msg}`);
    }
    warn(msg, at) {
        let line = typeof at === "number" ? at : (at ?? this.last).line;
        console.warn(`[${this.inputName} line ${line}]: ${msg}`);
    }
    parseText(token) {
        return {
            type: "text",
            line: token.line,
            text: token.val
        };
    }
    parseMacro(token) {
        let macro = {
            type: "macro",
            line: token.line,
            name: token.name,
            argString: token.args,
            body: null
        };
        if (macro.name[0] === '/') {
            this.warn(`Encountered ${token.val}, but <<${macro.name.substring(1)}>> is not a registered container macro`, token);
        }
        if (WikiParser.KnownContainerMacros.has(token.name)) {
            macro.body = [];
            const end1 = "/" + token.name;
            const end2 = "end" + token.name;
            for (let itoken of (0, utils_js_1.noreturn)(this.input)) {
                if (itoken.type === tokens_js_1.WikiTokenType.Macro && (itoken.name === end1 || itoken.name === end2)) {
                    return macro;
                }
                else {
                    macro.body.push(this.parseNext(itoken));
                }
            }
            this.error("Unterminated macro " + token.name, token);
        }
        else {
            return macro;
        }
    }
    parseNakedVar(token) {
        return {
            type: "var",
            line: token.line,
            expr: token.val
        };
    }
    parseComment(token) {
        return {
            type: "comment",
            line: token.line,
            subtype: token.val.startsWith("/*") ? "/*"
                : token.val.startsWith("/%") ? "/%" : "<!--",
            text: token.text
        };
    }
    parseBr(token) {
        return { type: "entity", subtype: "br", line: token.line, val: token.val };
    }
    parseHtml(startToken) {
        let result = {
            type: "html",
            attrs: [],
            body: null,
            line: startToken.line,
            name: startToken.name,
            single: false
        };
        while (true) {
            let token = this.expectAny(tokens_js_1.WikiTokenType.HtmlTagAttr, tokens_js_1.WikiTokenType.HtmlTagEnd);
            // ">" or "/>"
            if (token.type === tokens_js_1.WikiTokenType.HtmlTagEnd) {
                result.single = token.single;
                break;
            }
            // attribute
            result.attrs.push([token.name, token.value]);
        }
        result.single ||= WikiParser.VoidHtmlTags.has(result.name);
        if (!result.single) {
            result.body = [];
            while (true) {
                let itoken = this.nextOrNull();
                if (!itoken)
                    this.error("Unterminated tag " + result.name, startToken);
                if (itoken.type === tokens_js_1.WikiTokenType.HtmlTagClose && itoken.name === startToken.name)
                    break;
                result.body.push(this.parseNext(itoken));
            }
        }
        return result;
    }
    parseNext(token) {
        switch (token.type) {
            case tokens_js_1.WikiTokenType.Text:
                return this.parseText(token);
            case tokens_js_1.WikiTokenType.Macro:
                return this.parseMacro(token);
            case tokens_js_1.WikiTokenType.NakedVariable:
                return this.parseNakedVar(token);
            case tokens_js_1.WikiTokenType.Comment:
                return this.parseComment(token);
            case tokens_js_1.WikiTokenType.LineBreak:
                return this.parseBr(token);
            case tokens_js_1.WikiTokenType.HtmlTagStart:
                return this.parseHtml(token);
            case tokens_js_1.WikiTokenType.HtmlTagAttr:
            case tokens_js_1.WikiTokenType.HtmlTagEnd:
            case tokens_js_1.WikiTokenType.HtmlTagClose:
                this.error("Unexpected token " + tokens_js_1.WikiTokenType[token.type] + " " + token.val);
                return;
            default:
                this.error("Unknown token " + (tokens_js_1.WikiTokenType[token.type] ?? token.type));
        }
    }
    parseAll() {
        let result = [];
        for (let token of this.input) {
            result.push(this.parseNext(token));
        }
        return result;
    }
}
exports.WikiParser = WikiParser;
//# sourceMappingURL=WikiParser.js.map