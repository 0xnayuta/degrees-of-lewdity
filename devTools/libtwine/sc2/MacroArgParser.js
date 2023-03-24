"use strict";
/*
 * Created by aimozg on 03.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.bareArgToCode = exports.linkArgToCode = exports.argToCode = exports.parseArgs = exports.MacroArgLexer = exports.MacroArgType = void 0;
const AbstractLexer_js_1 = require("../AbstractLexer.js");
const utils_js_1 = require("../utils.js");
const patterns_js_1 = require("../patterns.js");
const twinescript_js_1 = require("./twinescript.js");
const LinkParser_js_1 = require("./LinkParser.js");
const helpers_js_1 = require("../tw2js/helpers.js");
var MacroArgType;
(function (MacroArgType) {
    MacroArgType[MacroArgType["String"] = 0] = "String";
    MacroArgType[MacroArgType["Expression"] = 1] = "Expression";
    MacroArgType[MacroArgType["Bare"] = 2] = "Bare";
    MacroArgType[MacroArgType["Link"] = 3] = "Link";
})(MacroArgType = exports.MacroArgType || (exports.MacroArgType = {}));
const EOF = '';
const spaceRe = new RegExp(patterns_js_1.default.space, 'g');
class MacroArgLexer extends AbstractLexer_js_1.AbstractLexer {
    constructor(input, inputName = "<unknown>") {
        super(MacroArgLexer.prototype.lexSpace, input, inputName);
    }
    *lexSpace() {
        this.skipWhitespace();
        if (this.eof) {
            this.state = null;
            return;
        }
        switch (this.next()) {
            case '`':
                this.state = this.lexExpression;
                break;
            case '"':
                this.state = this.lexDoubleQuote;
                break;
            case "'":
                this.state = this.lexSingleQuote;
                break;
            case '[':
                this.state = this.lexSquareBracket;
                break;
            default:
                this.state = this.lexBareword;
                break;
        }
    }
    *lexExpression() {
        if (!this.slurpQuote('`', true)) {
            this.error("unterminated quote");
        }
        let t = this.token(MacroArgType.Expression);
        t.text = (0, utils_js_1.unescapeString)(t.val.substring(1, t.val.length - 1));
        yield t;
        this.state = this.lexSpace;
    }
    depth = 0;
    *lexSquareBracket() {
        const imgMeta = /[<>IiMmGg]+/g;
        let what;
        if (this.match(imgMeta)) {
            what = 'image';
        }
        else {
            what = 'link';
        }
        if (!this.accept('[')) {
            return this.error(`malformed ${what} markup`);
        }
        this.depth = 2; // account for both initial left square brackets
        loop: for (;;) {
            // noinspection FallThroughInSwitchStatementJS
            switch (this.next()) {
                case '\\': {
                    const ch = this.next();
                    if (ch !== EOF && ch !== '\n') {
                        break;
                    }
                }
                case EOF:
                case '\n':
                    this.error(`unterminated ${what} markup`);
                    return;
                case '[':
                    ++this.depth;
                    break;
                case ']':
                    --this.depth;
                    if (this.depth < 0) {
                        this.error("unexpected right square bracket ']'");
                        return;
                    }
                    if (this.depth === 1) {
                        if (this.next() === ']') {
                            --this.depth;
                            break loop;
                        }
                        this.backup();
                    }
                    break;
            }
        }
        let t = this.token(MacroArgType.Link);
        t.text = t.val;
        yield t;
        this.state = this.lexSpace;
    }
    *lexBareword() {
        let match = this.match(spaceRe);
        if (match) {
            this.pos = match.index;
        }
        else {
            this.gotoEnd();
        }
        let token = this.token(MacroArgType.Bare, { text: '' });
        token.text = token.val;
        yield token;
        this.state = this.eof ? null : this.lexSpace;
    }
    *lexDoubleQuote() {
        if (!this.slurpQuote('"'))
            this.error("unterminated quote");
        let t = this.token(MacroArgType.String);
        t.text = (0, utils_js_1.unescapeString)(t.val.substring(1, t.val.length - 1));
        yield t;
        this.state = this.lexSpace;
    }
    *lexSingleQuote() {
        if (!this.slurpQuote("'")) {
            this.error("unterminated quote");
        }
        let t = this.token(MacroArgType.String);
        t.text = (0, utils_js_1.unescapeString)(t.val.substring(1, t.val.length - 1));
        yield t;
        this.state = this.lexSpace;
    }
}
exports.MacroArgLexer = MacroArgLexer;
function parseArgs(argString, inputName = "<unknown>", inputLine = 1) {
    if (!argString)
        return [];
    let lexer = new MacroArgLexer(argString);
    lexer.inputName = inputName;
    lexer.line = inputLine;
    return lexer.collect();
}
exports.parseArgs = parseArgs;
const varTest = new RegExp(`^${patterns_js_1.default.variable}`);
const literalTest = /^(null|undefined|true|false|NaN)$/;
function argToCode(arg, inputName = "<unknown>", line = 1) {
    switch (arg.type) {
        case MacroArgType.Bare:
            return bareArgToCode(arg.text);
        case MacroArgType.Expression:
            return (0, twinescript_js_1.parseTwineScript)(arg.text);
        case MacroArgType.String:
            return JSON.stringify(arg.text);
        case MacroArgType.Link:
            return linkArgToCode((0, LinkParser_js_1.parseSquareBracketedMarkup)(arg.text, inputName, line));
        default:
            return JSON.stringify(arg.text);
    }
}
exports.argToCode = argToCode;
function linkArgToCode(markup) {
    let arg = '{';
    // Convert to a link or image object.
    if (markup.isLink) {
        // .isLink, [.text], [.forceInternal], .link, [.setter]
        // arg += 'isLink:true';
        //arg += 'count:'+(markup.hasOwnProperty('text') ? 2 : 1);
        arg += 'link:' + (0, helpers_js_1.evalPassageId)(markup.link);
        if (markup.hasOwnProperty('text')) {
            arg += ', text:' + (0, helpers_js_1.evalText)(markup.text);
        }
        if (markup.hasOwnProperty('setter')) {
            arg += ', setter: ()=>{' + (0, twinescript_js_1.parseTwineScript)(markup.setter) + '}';
        }
    }
    else if (markup.isImage) {
        // .isImage, [.align], [.title], .source, [.forceInternal], [.link], [.setter]
        arg += 'img:true';
        arg += ', src:' + (0, helpers_js_1.evalPassageId)(markup.source);
        if (markup.hasOwnProperty('align')) {
            arg += ', align: ' + JSON.stringify(markup.align);
        }
        if (markup.hasOwnProperty('text')) {
            arg += ', title: ' + (0, helpers_js_1.evalText)(markup.text);
        }
        if (markup.hasOwnProperty('link')) {
            arg += ', link: ' + (0, helpers_js_1.evalPassageId)(markup.link);
            //arg.external = !markup.forceInternal && Wikifier.isExternalLink(arg.link);
        }
        if (markup.hasOwnProperty('setter')) {
            arg += ', setter: ()=>{' + (0, twinescript_js_1.parseTwineScript)(markup.setter) + '}';
        }
    }
    arg += '}';
    return arg;
}
exports.linkArgToCode = linkArgToCode;
function bareArgToCode(arg) {
    // A variable, so substitute its value.
    if (varTest.test(arg)) {
        return (0, twinescript_js_1.parseTwineScript)(arg);
    }
    // Property access on the settings or setup objects, so try to evaluate it.
    else if (/^(?:settings|setup)[.[]/.test(arg)) {
        return (0, twinescript_js_1.parseTwineScript)(arg);
    }
    // Null literal, so convert it into null.
    // Undefined literal, so convert it into undefined.
    // Boolean true literal, so convert it into true.
    // Boolean false literal, so convert it into false.
    // NaN literal, so convert it into NaN.
    else if (literalTest.test(arg)) {
        return arg;
    }
    // Attempt to convert it into a number, in case it's a numeric literal.
    else {
        const argAsNum = Number(arg);
        if (!Number.isNaN(argAsNum)) {
            if (arg.startsWith('0x') || arg.startsWith('0b')) {
                return arg;
            }
            return String(argAsNum);
        }
    }
    // return as string
    return JSON.stringify(arg);
}
exports.bareArgToCode = bareArgToCode;
//# sourceMappingURL=MacroArgParser.js.map