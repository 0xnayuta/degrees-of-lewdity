"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SugarCubeCompiler = void 0;
const JsWriter_js_1 = require("./JsWriter.js");
const MacroArgParser_js_1 = require("../sc2/MacroArgParser.js");
const WikiWriter_js_1 = require("../sc2/WikiWriter.js");
const patterns_js_1 = require("../patterns.js");
class SugarCubeCompiler extends JsWriter_js_1.JsWriter {
    constructor(options = {}) {
        super(options);
        this.options = options = Object.assign({}, options);
        this.knownMacros = options.knownMacros ?? {};
        this.inputName = options.inputName ?? "<unknown>";
        options.trimWidgetNewlines ??= false;
        options.nobr ??= false;
        options.commentLineNos ??= false;
        options.localVars ??= false;
    }
    options;
    inputName;
    knownMacros;
    macroLibrary = {};
    output = "ignore";
    registerMacroLibrary(macros) {
        Object.assign(this.macroLibrary, macros);
    }
    throwError(msg, lineno) {
        if (typeof lineno === 'number')
            msg = `[${this.inputName} line ${lineno}]: ${msg}`;
        else
            msg = `[${this.inputName}: ${msg}`;
        throw new Error(msg);
    }
    write(code) {
        if (this.options.localVars && !code.startsWith('/*') && !code.startsWith('//')) {
            // example:
            // <<set _text_output to "$_var">><<print _text_output>>
            const reLocalVar = new RegExp(`\\$_(${patterns_js_1.default.identifier})`, "g");
            for (let lv of code.matchAll(reLocalVar)) {
                super.write(`V["_${lv[1]}"] = ${this.localVarName(lv[1])};`);
            }
        }
        super.write(code);
        if (this.lastToken && this.options.commentLineNos) {
            let s = this.last();
            s = '/* ' + this.inputName + ':' + this.lastToken.line + ' */ ' + s;
            this.replaceLast(s);
            this.lastToken = null;
        }
        this.lastPrint = null;
    }
    lastPrint = null;
    lastToken;
    writePrint(code, always = false) {
        switch (this.output) {
            case "ignore":
                if (always) {
                    this.writeCall("$.wiki", code);
                }
                break;
            case "wprint":
                let lp = this.lastPrint;
                if (lp !== null && lp && code) {
                    if (lp.endsWith('"') && code.startsWith('"')
                        || lp.endsWith("'") && code.startsWith("'")
                        || lp.endsWith("`") && code.startsWith("`")) {
                        code = lp.slice(0, lp.length - 1) + code.slice(1);
                        this.replaceLast(this.indentString + this.mkCall('W.print', [code]));
                        this.lastPrint = code;
                    }
                    else {
                        // We can't merge W.print(x); W.print(y); to W.print(x+y); because of
                        // (a) type conversion
                        // (b) different handling of null & undefined by SC
                        // code = lp + ' + ' + code;
                        this.writeCall('W.print', code);
                        this.lastPrint = code;
                    }
                }
                else {
                    this.writeCall('W.print', code);
                    this.lastPrint = code;
                }
                break;
        }
    }
    writePrintRaw(code, always = false) {
        switch (this.output) {
            case "ignore":
                if (always) {
                    this.write(`(${code});`);
                }
                break;
            case "wprint":
                this.writeCall('W.print', code, "true");
                break;
        }
    }
    wikifyHere(content, always) {
        this.writePrint(this.mkLiteral(content), always);
    }
    compile(item) {
        if (this.options.nobr) {
            item = this.nobrContentOne(item);
        }
        this.lastToken = item;
        switch (item.type) {
            case "text":
                this.writePrint(this.mkLiteral(item.text), false);
                break;
            case "macro":
                this.compileMacro(item);
                break;
            case "var":
                this.writePrint(this.mkTwinescript(item.expr));
                break;
            case "comment":
                this.writeBlockComment(item.text);
                break;
            case "entity":
                // TODO @aimozg treat entities differently
                this.writePrint(this.mkLiteral(item.val), false);
                break;
            case "html":
                this.compileHtml(item);
                break;
        }
    }
    compileHtml(html) {
        let cName = this.mkLiteral(html.name);
        let attrs = html.attrs.map(a => {
            let name = a[0];
            let value = a[1];
            if (name[0] === '@') {
                name = name.substring(1);
                value = this.mkTwinescript(value);
            }
            else {
                value = value ? this.mkLiteral(value) : "true";
            }
            return this.mkObjectLiteralKey(name) + ": " + value;
        });
        let cAttrs = attrs.length > 0 ? '{' + attrs.join(', ') + '}' : '';
        if (html.body && html.body.length > 0) {
            if (!cAttrs)
                cAttrs = "null";
            this.indent(`W.$html(${cName}, ${cAttrs}, ()=>{`);
            this.compileAll(html.body);
            this.unindent(`});`);
        }
        else {
            if (cAttrs) {
                this.write(`W.$html(${cName}, ${cAttrs});`);
            }
            else {
                this.write(`W.$html(${cName});`);
            }
        }
    }
    nobrContentOne(item) {
        if (item.type === "entity" && item.val === "\n") {
            return {
                type: "text",
                line: item.line,
                text: " "
            };
        }
        else if (item.type === "text") {
            return {
                type: "text",
                line: item.line,
                text: nobrstring(item.text)
            };
        }
        else if (item.type === "html") {
            return {
                type: "html",
                line: item.line,
                name: item.name,
                single: item.single,
                attrs: item.attrs.map(([name, value]) => [nobrstring(name), nobrstring(value)]),
                body: item.body
            };
        }
        return item;
    }
    nobrContentMany(content) {
        if (content.length === 0)
            return content;
        // Convert newlines to text, merge texts together, and replace whitespace with single space
        let last = this.nobrContentOne(content[0]);
        let output = [last];
        for (let i = 1; i < content.length; i++) {
            let next = this.nobrContentOne(content[i]);
            if (last.type === "text" && next.type === "text") {
                last.text = (last.text + next.text).replace(/\s+/g, ' ');
            }
            else {
                output.push(next);
                last = next;
            }
        }
        return output;
    }
    /**
     * @param content
     * @param special A dictionary of special macro handlers (`{macro name: handler}`).
     * These handlers will be invoked instead of default compile();
     * No args will be passed to handler, handler is responsible to parse `specialMacro.argString`
     */
    compileAll(content, special = {}) {
        if (content.length === 0)
            return;
        if (this.options.nobr)
            content = this.nobrContentMany(content);
        for (let item of content) {
            if (item.type === "macro" && item.name in special) {
                special[item.name](this, item);
            }
            else {
                this.compile(item);
            }
        }
    }
    static JsReservedWords = new Set(['await', 'break', 'case', 'catch', 'class', 'const', 'continue', 'debugger', 'default', 'delete', 'do', 'else', 'export', 'extends', 'false', 'finally', 'for', 'function', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null', 'return', 'static', 'super', 'switch', 'this', 'throw', 'true', 'try', 'typeof', 'var', 'void', 'while', 'with', 'yield']);
    /**
     * @param varname local variable name (minus `$_` prefix)
     * @return assigned JS variable name (reserved words get `$_` prefix)
     */
    localVarName(varname) {
        if (SugarCubeCompiler.JsReservedWords.has(varname))
            return '$_' + varname;
        return varname;
    }
    extractLocalVars(functionStartPos) {
        if (!this.options.localVars)
            return;
        const localVars = new Set();
        const reLocalVar = new RegExp(`V\\._(${patterns_js_1.default.identifier})`, 'g');
        for (let i = functionStartPos.index; i < this.buffer.length; i++) {
            let line = this.buffer[i];
            this.buffer[i] = line.replaceAll(reLocalVar, (s, varname) => {
                varname = this.localVarName(varname);
                localVars.add(varname);
                return varname;
            });
        }
        if (localVars.size > 0) {
            this.insertBack(functionStartPos, ["let " + [...localVars].join(", ") + ";"]);
        }
    }
    compilePassage(passageName, content) {
        this.output = "wprint";
        this.indent(`W.$passages[${this.mkLiteral(passageName)}] = ()=>{`);
        let localVarPos = this.rememberPos();
        this.compileAll(content);
        this.unindent(`};`);
        this.extractLocalVars(localVarPos);
    }
    /**
     * `W.name(arg1, arg2)`
     */
    compileMacroCall(name, args) {
        this.writeCall(`W${this.mkAccessor(name)}`, ...args);
    }
    /**
     * `W.name([arg1, arg2], "body")`
     */
    compileMacroBlockCall(name, args, body) {
        this.writeCall(`W${this.mkAccessor(name)}`, '[' + args.join(', ') + ']', this.mkLiteral(body));
    }
    /**
     * `W.name([arg1, arg2], ()=>{} )`
     */
    compileMacroBlockFn(name, args, body) {
        this.indent(`W${this.mkAccessor(name)}([${args.join(', ')}], ()=>{`);
        this.compileAll(body);
        this.unindent(`});`);
    }
    compileUnknownMacro(name, args) {
        this.writeCall(`W.$macro`, this.mkLiteral(name), ...args);
    }
    compileUnknownContainerMacro(name, args, body) {
        this.indent(`W.$container(${this.mkLiteral(name)}, [${args.join(', ')}], ()=>{`);
        this.compileAll(body);
        this.unindent(`});`);
        //this.writeCall(`W.$container`,this.mkLiteral(name), '['+args.join(', ')+']', this.mkLiteral(wikiWriteAll(body)));
    }
    // TODO
    //  - template strings with text-returning widgets ("You see <<him>>" -> `You see ${W.him()}`)
    compileDefaultMacro(macro) {
        let tags = this.knownMacros[macro.name] ?? [];
        if (tags.includes("raw")) {
            this.wikifyHere((0, WikiWriter_js_1.wikiWrite)(macro), true);
            return;
        }
        let args;
        if (tags.includes("skipArgs")) {
            args = [this.mkLiteral(macro.argString)];
        }
        else {
            args = (0, MacroArgParser_js_1.parseArgs)(macro.argString, this.inputName, macro.line)
                .map(a => (0, MacroArgParser_js_1.argToCode)(a, this.inputName, macro.line));
        }
        if (tags.includes("container")) {
            if (tags.includes("blockCall")) {
                this.compileMacroBlockCall(macro.name, args, (0, WikiWriter_js_1.wikiWriteAll)(macro.body));
            }
            else if (tags.includes("blockFn")) {
                this.compileMacroBlockFn(macro.name, args, macro.body);
            }
            else {
                console.warn(this.inputName + ':' + macro.line, `Untagged container macro ${macro.name}`);
                this.compileUnknownContainerMacro(macro.name, args, macro.body);
                //this.wikifyHere(wikiWrite(macro), true);
            }
        }
        else {
            this.compileUnknownMacro(macro.name, args);
        }
    }
    compileMacro(macro) {
        let decl = this.macroLibrary[macro.name];
        if (!decl) {
            this.compileDefaultMacro(macro);
            return;
        }
        let macroCallArgs = decl.skipArgs
            ? []
            : (0, MacroArgParser_js_1.parseArgs)(macro.argString, this.inputName + " <<" + macro.name + ">>", macro.line);
        decl.handler(this, macro, ...macroCallArgs);
    }
}
exports.SugarCubeCompiler = SugarCubeCompiler;
function nobrstring(s) {
    return s.replace(/\s+/g, ' ');
}
//# sourceMappingURL=SugarCubeCompiler.js.map