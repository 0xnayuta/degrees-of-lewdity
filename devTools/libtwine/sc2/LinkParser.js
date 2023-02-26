"use strict";
/*
 * Created by aimozg on 18.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSquareBracketedMarkup = exports.LinkTokenType = void 0;
const AbstractLexer_js_1 = require("../AbstractLexer.js");
var LinkTokenType;
(function (LinkTokenType) {
    /** error */
    LinkTokenType[LinkTokenType["Error"] = 0] = "Error";
    /** '|' or '->' */
    LinkTokenType[LinkTokenType["DelimLTR"] = 1] = "DelimLTR";
    /** '<-' */
    LinkTokenType[LinkTokenType["DelimRTL"] = 2] = "DelimRTL";
    /** '][' */
    LinkTokenType[LinkTokenType["InnerMeta"] = 3] = "InnerMeta";
    /** '[img[', '[<img[', or '[>img[' */
    LinkTokenType[LinkTokenType["ImageMeta"] = 4] = "ImageMeta";
    /** '[[' */
    LinkTokenType[LinkTokenType["LinkMeta"] = 5] = "LinkMeta";
    /** link destination */
    LinkTokenType[LinkTokenType["Link"] = 6] = "Link";
    /** ']]' */
    LinkTokenType[LinkTokenType["RightMeta"] = 7] = "RightMeta";
    /** setter expression */
    LinkTokenType[LinkTokenType["Setter"] = 8] = "Setter";
    /** image source */
    LinkTokenType[LinkTokenType["Source"] = 9] = "Source";
    /** link text or image alt text */
    LinkTokenType[LinkTokenType["Text"] = 10] = "Text";
})(LinkTokenType = exports.LinkTokenType || (exports.LinkTokenType = {}));
var Delim;
(function (Delim) {
    Delim[Delim["None"] = 0] = "None";
    Delim[Delim["LTR"] = 1] = "LTR";
    Delim[Delim["RTL"] = 2] = "RTL";
})(Delim || (Delim = {}));
class LinkLexer extends AbstractLexer_js_1.AbstractLexer {
    constructor(input, inputName, line) {
        super(LinkLexer.prototype.lexLeftMeta, input, inputName, line);
    }
    data = {
        isLink: false
    };
    depth = 1;
    *lexLeftMeta() {
        if (!this.accept('[')) {
            this.error('malformed square-bracketed markup');
        }
        // Is link markup.
        if (this.accept('[')) {
            this.data.isLink = true;
            yield this.token(LinkTokenType.LinkMeta);
        }
        else {
            // May be image markup.
            this.accept('<>'); // aligner syntax
            if (!this.accept('Ii') || !this.accept('Mm') || !this.accept('Gg') || !this.accept('[')) {
                this.error('malformed square-bracketed markup');
            }
            this.data.isLink = false;
            yield this.token(LinkTokenType.ImageMeta);
        }
        this.depth = 2; // account for both initial left square brackets
        this.state = this.lexCoreComponents;
    }
    *lexCoreComponents() {
        const what = this.data.isLink ? 'link' : 'image';
        let delim = Delim.None;
        while (true) {
            switch (this.next()) {
                case '':
                case '\n':
                    return this.error(`unterminated ${what} markup`);
                case '"':
                    /*
                        This is not entirely reliable within sections that allow raw strings, since
                        it's possible, however unlikely, for a raw string to contain unpaired double
                        quotes.  The likelihood is low enough, however, that I'm deeming the risk as
                        acceptable—for now, at least.
                    */
                    if (!this.slurpQuote('"')) {
                        return this.error(`unterminated double quoted string in ${what} markup`);
                    }
                    break;
                case '|': // possible pipe ('|') delimiter
                    if (delim === Delim.None) {
                        delim = Delim.LTR;
                        this.backup();
                        yield this.token(LinkTokenType.Text);
                        this.forward();
                        yield this.token(LinkTokenType.DelimLTR);
                        // lexer.ignore();
                    }
                    break;
                case '-': // possible right arrow ('->') delimiter
                    if (delim === Delim.None && this.peek() === '>') {
                        delim = Delim.LTR;
                        this.backup();
                        yield this.token(LinkTokenType.Text);
                        this.forward(2);
                        yield this.token(LinkTokenType.DelimLTR);
                        // lexer.ignore();
                    }
                    break;
                case '<': // possible left arrow ('<-') delimiter
                    if (delim === Delim.None && this.peek() === '-') {
                        delim = Delim.RTL;
                        this.backup();
                        yield this.token(this.data.isLink ? LinkTokenType.Link : LinkTokenType.Source);
                        this.forward(2);
                        yield this.token(LinkTokenType.DelimRTL);
                        // lexer.ignore();
                    }
                    break;
                case '[':
                    ++this.depth;
                    break;
                case ']':
                    --this.depth;
                    if (this.depth === 1) {
                        switch (this.peek()) {
                            case '[':
                                ++this.depth;
                                this.backup();
                                if (delim === Delim.RTL) {
                                    yield this.token(LinkTokenType.Text);
                                }
                                else {
                                    yield this.token(this.data.isLink ? LinkTokenType.Link : LinkTokenType.Source);
                                }
                                this.forward(2);
                                yield this.token(LinkTokenType.InnerMeta);
                                // lexer.ignore();
                                this.state = this.data.isLink ? this.lexSetter : this.lexImageLink;
                                return;
                            case ']':
                                --this.depth;
                                this.backup();
                                if (delim === Delim.RTL) {
                                    yield this.token(LinkTokenType.Text);
                                }
                                else {
                                    yield this.token(this.data.isLink ? LinkTokenType.Link : LinkTokenType.Source);
                                }
                                this.forward(2);
                                yield this.token(LinkTokenType.RightMeta);
                                // lexer.ignore();
                                this.state = null;
                                return;
                            default:
                                return this.error(`malformed ${what} markup`);
                        }
                    }
                    break;
            }
        }
    }
    *lexImageLink() {
        const what = this.data.isLink ? 'link' : 'image';
        while (true) {
            switch (this.next()) {
                case '':
                case '\n':
                    return this.error(`unterminated ${what} markup`);
                case '"':
                    /*
                        This is not entirely reliable within sections that allow raw strings, since
                        it's possible, however unlikely, for a raw string to contain unpaired double
                        quotes.  The likelihood is low enough, however, that I'm deeming the risk as
                        acceptable—for now, at least.
                    */
                    if (!this.slurpQuote('"')) {
                        return this.error(`unterminated double quoted string in ${what} markup link component`);
                    }
                    break;
                case '[':
                    ++this.depth;
                    break;
                case ']':
                    --this.depth;
                    if (this.depth === 1) {
                        switch (this.peek()) {
                            case '[':
                                ++this.depth;
                                this.backup();
                                yield this.token(LinkTokenType.Link);
                                this.forward(2);
                                yield this.token(LinkTokenType.InnerMeta);
                                // lexer.ignore();
                                this.state = this.lexSetter;
                                return;
                            case ']':
                                --this.depth;
                                this.backup();
                                yield this.token(LinkTokenType.Link);
                                this.forward(2);
                                yield this.token(LinkTokenType.RightMeta);
                                // lexer.ignore();
                                this.state = null;
                                return;
                            default:
                                return this.error(`malformed ${what} markup`);
                        }
                    }
                    break;
            }
        }
    }
    *lexSetter() {
        const what = this.data.isLink ? 'link' : 'image';
        for (;;) {
            switch (this.next()) {
                case '':
                case '\n':
                    return this.error(`unterminated ${what} markup`);
                case '"':
                    if (!this.slurpQuote('"')) {
                        return this.error(`unterminated double quoted string in ${what} markup setter component`);
                    }
                    break;
                case "'":
                    if (!this.slurpQuote("'")) {
                        return this.error(`unterminated single quoted string in ${what} markup setter component`);
                    }
                    break;
                case '[':
                    ++this.depth;
                    break;
                case ']':
                    --this.depth;
                    if (this.depth === 1) {
                        if (this.peek() !== ']') {
                            return this.error(`malformed ${what} markup`);
                        }
                        --this.depth;
                        this.backup();
                        yield this.token(LinkTokenType.Setter);
                        this.forward(2);
                        yield this.token(LinkTokenType.RightMeta);
                        // lexer.ignore();
                        return null;
                    }
                    break;
            }
        }
    }
}
function parseSquareBracketedMarkup(source, inputName = "<unknown>", line = 1) {
    const lexer = new LinkLexer(source, inputName, line);
    // Lex the raw argument string.
    const markup = {};
    for (let item of lexer.run()) {
        const text = item.val.trim();
        switch (item.type) {
            case LinkTokenType.ImageMeta:
                markup.isImage = true;
                if (text[1] === '<') {
                    markup.align = 'left';
                }
                else if (text[1] === '>') {
                    markup.align = 'right';
                }
                break;
            case LinkTokenType.LinkMeta:
                markup.isLink = true;
                break;
            case LinkTokenType.Link:
                if (text[0] === '~') {
                    markup.forceInternal = true;
                    markup.link = text.slice(1);
                }
                else {
                    markup.link = text;
                }
                break;
            case LinkTokenType.Setter:
                markup.setter = text;
                break;
            case LinkTokenType.Source:
                markup.source = text;
                break;
            case LinkTokenType.Text:
                markup.text = text;
                break;
        }
    }
    return markup;
}
exports.parseSquareBracketedMarkup = parseSquareBracketedMarkup;
//# sourceMappingURL=LinkParser.js.map