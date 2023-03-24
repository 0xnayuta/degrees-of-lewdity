"use strict";
/*
 * Created by aimozg on 03.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsWriter = void 0;
const twinescript_js_1 = require("../sc2/twinescript.js");
const patterns_js_1 = require("../patterns.js");
const reIdentifier = new RegExp('^' + patterns_js_1.default.identifier + '$');
class JsWriter {
    constructor(options = {}) {
        this.indentChar = options.indent ?? '\t';
    }
    indentChar;
    buffer = [];
    /** Current indent */
    indentString = '';
    /**
     * Free object to pass code generation context
     */
    context = {};
    isEmpty() {
        return this.buffer.length === 0;
    }
    indent(appendBefore = '') {
        if (appendBefore)
            this.write(appendBefore);
        this.indentString += this.indentChar;
    }
    unindent(appendAfter = '') {
        this.indentString = this.indentString.slice(this.indentChar.length);
        if (appendAfter)
            this.write(appendAfter);
    }
    writeEmptyLine() {
        this.buffer.push('');
    }
    static debug = false;
    last() {
        return (this.buffer.length === 0) ? null : this.buffer[this.buffer.length - 1];
    }
    replaceLast(replacement) {
        if (this.buffer.length === 0)
            throw new Error("replaceLast call on empty buffer");
        this.buffer[this.buffer.length - 1] = replacement;
    }
    rememberPos() {
        return { index: this.buffer.length, indent: this.indentString };
    }
    insertBack(pos, lines) {
        this.buffer.splice(pos.index, 0, ...lines.map(code => pos.indent + code));
    }
    write(code) {
        code = this.indentString + code;
        if (code.includes('\n'))
            code = code.replaceAll('\n', '\n' + this.indentString);
        if (JsWriter.debug)
            console.log(code);
        this.buffer.push(code);
    }
    writeUnindented(code) {
        this.unindent();
        this.write(code);
        this.indent();
    }
    writeBlockComment(comment) {
        this.write(this.mkBlockComment(comment));
    }
    writeCall(lhs, ...args) {
        this.write(this.mkCall(lhs, args));
    }
    buildSources() {
        if (this.buffer.length === 0)
            return '';
        if (this.buffer.length > 0)
            this.buffer = [this.buffer.join('\n')];
        return this.buffer[0];
    }
    mkCall(lhs, args) {
        return lhs + '(' + args.join(", ") + ');';
    }
    /**
     * @return {string} `.keyLiteral` or `["keyLiteral"]`
     */
    mkAccessor(keyLiteral) {
        if (reIdentifier.test(keyLiteral))
            return "." + keyLiteral;
        return "[" + this.mkLiteral(keyLiteral) + "]";
    }
    mkLiteral(l) {
        return JSON.stringify(l);
    }
    mkObjectLiteralKey(key) {
        const reId = new RegExp('^' + patterns_js_1.default.identifier + '$');
        if (reId.test(key))
            return key;
        return this.mkLiteral(key);
    }
    mkTwinescript(ts) {
        return (0, twinescript_js_1.parseTwineScript)(ts);
    }
    mkBlockComment(comment) {
        return '/* ' + comment.replaceAll('*/', '*!/').replaceAll('/*', '/!*') + ' */';
    }
}
exports.JsWriter = JsWriter;
//# sourceMappingURL=JsWriter.js.map