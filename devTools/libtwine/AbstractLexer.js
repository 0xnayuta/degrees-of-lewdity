"use strict";
/*
 * Created by aimozg on 03.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractLexer = void 0;
// Based on https://github.com/tmedwards/tweego/blob/master/internal/tweelexer/tweelexer.go
// Tweego is (c) Thomas Michael Edwards
const EOF = '';
class AbstractLexer {
    input;
    inputName;
    line;
    /**
     * @param initialState a `function*(lexer:AbstractLexer):void`
     * @param input input text
     * @param inputName input file name (for error reporting)
     * @param line Starting line number (1-base, default 1)
     */
    constructor(initialState, input, inputName = "<unknown>", line = 1) {
        this.input = input;
        this.inputName = inputName;
        this.line = line;
        this.state = initialState;
    }
    /**
     * State function SHOULD do `this.state = this.nextState` unless either 1) state is same; 2) defaultState is set
     */
    state;
    defaultState = null;
    start = 0; // start pos of current item
    pos = 0; // current position within input
    nextMatch = 0; // when regex was matched, index after the match
    get eof() {
        return this.pos >= this.input.length;
    }
    *run() {
        while (this.state) {
            let state = this.state;
            if (this.defaultState)
                this.state = this.defaultState;
            yield* state.call(this);
        }
    }
    collect() {
        return [...this.run()];
    }
    error(msg) {
        throw new Error(`[${this.inputName}:${this.line}] ${msg}`);
    }
    warn(...args) {
        console.warn(`[${this.inputName}:${this.line}]`, ...args);
    }
    pending() {
        return this.input.substring(this.start, this.pos);
    }
    /**
     * true if next input is `s`
     */
    prefixed(s) {
        return this.input.substring(this.pos, s.length) === s;
    }
    /**
     * find `s` and set this.pos to its start. if not found, return false
     */
    skipUntil(s) {
        let i = this.input.indexOf(s, this.pos);
        if (i > -1) {
            this.pos = i;
            return true;
        }
        return false;
    }
    /**
     * consume characters until [quote] respecting backslash escape
     * @param quote
     * @param multiline
     * @return true if closing quote encountered, false if hit EOF or newline (multiline=false)
     */
    slurpQuote(quote, multiline = false) {
        while (true) {
            let c = this.next();
            if (c === '' || !multiline && c === '\n')
                return false;
            if (c === '\\') {
                c = this.next();
                if (c === '' || !multiline && c === '\n')
                    return false;
            }
            if (c === quote)
                return true;
        }
    }
    /** next char */
    peek() {
        return this.input[this.pos];
    }
    /** consume and return next char */
    next() {
        if (this.eof)
            return EOF;
        const r = this.input[this.pos];
        this.pos++;
        if (r === '\n')
            this.line++;
        return r;
    }
    /** skip to end of input, return true if any chars are pending, false if already were at eof */
    gotoEnd() {
        this.pos = this.input.length;
        return this.pos > this.start;
    }
    /** go back 1 char */
    backup() {
        if (this.pos <= this.start) {
            throw new Error(`backup() behind start=${this.start}`);
        }
        this.pos--;
        if (this.input[this.pos] === '\n')
            this.line--;
    }
    forward(n = 1) {
        this.pos += n;
    }
    accept(char) {
        if (char === this.peek()) {
            this.next();
            return true;
        }
        return false;
    }
    /** If next char is any of `validChars`, accept it and return true */
    acceptAny(validChars) {
        let x = this.peek();
        for (let c of validChars) {
            if (c === x) {
                this.next();
                return true;
            }
        }
        return false;
    }
    skipWhitespace() {
        while (true) {
            let c = this.peek();
            if (c === ' ' || c === '\t') {
                this.next();
            }
            else {
                break;
            }
        }
        this.ignore();
    }
    /**
     * Execute the regex and return result. Updates nextMatch but not pos!
     */
    match(regex) {
        regex.lastIndex = this.pos;
        let result = regex.exec(this.input);
        if (result)
            this.nextMatch = regex.lastIndex;
        return result;
    }
    /** @return {Token} */
    token(type, extraArgs = {}) {
        let item = { type, line: this.line, pos: this.start, val: this.pending(), ...extraArgs };
        this.ignore();
        return item;
    }
    // skip pending input
    ignore() {
        let s = this.pending();
        for (let c of s)
            if (c === '\n')
                this.line++;
        this.start = this.pos;
    }
}
exports.AbstractLexer = AbstractLexer;
//# sourceMappingURL=AbstractLexer.js.map