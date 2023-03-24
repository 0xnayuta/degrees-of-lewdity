"use strict";
/**
 * Tweego lexer, converting string into a sequence of tokens
 *
 * Created by aimozg on 02.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.TweeLexer = exports.TweeTokenType = void 0;
// Based on https://github.com/tmedwards/tweego/blob/master/internal/tweelexer/tweelexer.go
// Tweego is (c) Thomas Michael Edwards
const AbstractLexer_js_1 = require("../AbstractLexer.js");
var TweeTokenType;
(function (TweeTokenType) {
    TweeTokenType[TweeTokenType["Error"] = 0] = "Error";
    TweeTokenType[TweeTokenType["EOF"] = 1] = "EOF";
    TweeTokenType[TweeTokenType["Header"] = 2] = "Header";
    TweeTokenType[TweeTokenType["Name"] = 3] = "Name";
    TweeTokenType[TweeTokenType["Tags"] = 4] = "Tags";
    TweeTokenType[TweeTokenType["Metadata"] = 5] = "Metadata";
    TweeTokenType[TweeTokenType["Content"] = 6] = "Content"; // Plain text.
})(TweeTokenType = exports.TweeTokenType || (exports.TweeTokenType = {}));
const EOF = '';
const headerDelim = "::";
const newlineHeaderDelim = "\n::";
class TweeLexer extends AbstractLexer_js_1.AbstractLexer {
    constructor(input, inputName = "<unknown>") {
        super(TweeLexer.prototype.lexProlog, input, inputName);
    }
    *lexProlog() {
        if (this.prefixed(headerDelim)) {
            this.state = this.lexHeaderDelim;
            return;
        }
        if (this.skipUntil(newlineHeaderDelim)) {
            this.pos++;
            this.ignore();
            this.state = this.lexHeaderDelim;
            return;
        }
        yield this.token(TweeTokenType.EOF);
        this.state = null;
    }
    *lexHeaderDelim() {
        this.pos += headerDelim.length;
        yield this.token(TweeTokenType.Header);
        this.state = this.lexName;
    }
    *lexName() {
        let r;
        loop: while (true) {
            r = this.next();
            switch (r) {
                case '\\':
                    r = this.next();
                    if (r === EOF) {
                        this.error("unexpected EOF");
                    }
                    else if (r !== '\n' && r !== EOF) {
                        this.backup();
                        break loop;
                    }
                    break;
                case EOF:
                    break loop;
                case '[':
                case ']':
                case '{':
                case '}':
                case '\n':
                    this.backup();
                    break loop;
            }
        }
        yield this.token(TweeTokenType.Name);
        this.state = this.lexNextOptionalBlock;
    }
    *lexNextOptionalBlock() {
        this.skipWhitespace();
        this.ignore();
        let r = this.peek();
        switch (r) {
            case '[':
                this.state = this.lexTags;
                break;
            case ']':
            case '}':
                this.error("unexpected " + r);
                break;
            case '{':
                this.state = this.lexMetadata;
                break;
            case '\n':
                this.pos++;
                this.ignore();
                this.state = this.lexContent;
                break;
            case EOF:
                yield this.token(TweeTokenType.EOF);
                break;
            default:
                this.error("illegal character " + r);
        }
    }
    *lexTags() {
        this.pos++;
        loop: while (true) {
            let r = this.next();
            switch (r) {
                case '\\':
                    r = this.next();
                    if (r === '\n' || r === EOF)
                        this.error("unterminated tag block");
                    break;
                case '\n':
                case EOF:
                    this.error("unterminated tag block");
                    break;
                case ']':
                    break loop;
                case '[':
                case '{':
                case '}':
                    this.error("unexpected " + r);
            }
        }
        if (this.pos > this.start) {
            yield this.token(TweeTokenType.Tags);
        }
        this.state = this.lexNextOptionalBlock;
    }
    *lexContent() {
        if (this.prefixed(headerDelim)) {
            this.state = this.lexHeaderDelim;
            return;
        }
        if (this.skipUntil(newlineHeaderDelim)) {
            this.pos++;
            yield this.token(TweeTokenType.Content);
            this.state = this.lexHeaderDelim;
            return;
        }
        if (this.gotoEnd()) {
            yield this.token(TweeTokenType.Content);
        }
        yield this.token(TweeTokenType.EOF);
        this.state = null;
    }
    *lexMetadata() {
        // TODO implement lexMetadata
        this.error("Passage metadata parsing is not implemented");
    }
}
exports.TweeLexer = TweeLexer;
//# sourceMappingURL=TweeLexer.js.map