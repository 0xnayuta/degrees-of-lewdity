import { JsWriter } from "./JsWriter.js";
import { parseArgs } from "../sc2/MacroArgParser.js";
import { wikiWrite } from "../sc2/WikiWriter.js";
export class WidgetCompiler extends JsWriter {
    constructor(options = {}) {
        super(options);
        this.inputName = options.inputName ?? "<unknown>";
        this.trimWidgetNewlines = options.trimWidgetNewlines ?? false;
        this.nobr = options.nobr ?? false;
        this.commentLineNos = options.commentLineNos ?? false;
    }
    inputName;
    knownMacros = {};
    /** Remove leading & trailing newlines from widget code */
    trimWidgetNewlines;
    /** All consecutive whitespace characters are replaced with single spaces */
    nobr;
    commentLineNos;
    output = "ignore";
    registerKnownMacros(macros) {
        Object.assign(this.knownMacros, macros);
    }
    throwError(msg, lineno) {
        if (typeof lineno === 'number')
            msg = `[${this.inputName} line ${lineno}]: ${msg}`;
        else
            msg = `[${this.inputName}: ${msg}`;
        throw new Error(msg);
    }
    write(code) {
        super.write(code);
        if (this.lastToken && this.commentLineNos) {
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
                    }
                    else {
                        code = lp + ' + ' + code;
                    }
                    this.replaceLast(this.indentString + this.mkCall('W.print', [code]));
                    this.lastPrint = code;
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
        if (this.nobr) {
            item = this.nobrContentOne(item);
        }
        this.lastToken = item;
        switch (item.type) {
            case "text":
                this.wikifyHere(item.text, false);
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
                this.wikifyHere(item.val, false);
                break;
            case "html":
                this.compileHtml(item);
                break;
        }
    }
    compileHtml(html) {
        // TODO allow short variants:
        //  - <span class="foo">Static text</span> => W.print("<span class=\"foo\">Static text</span>");
        //  - <span @class="$foo">Static text</span> => W.$html("span", {class: V.foo}, "Static text");
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
        if (this.nobr)
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
    compileMacroCall(name, args) {
        this.writeCall(`W${this.mkAccessor(name)}`, ...args);
    }
    // TODO
    //  - template strings with text-returning widgets ("You see <<him>>" -> `You see ${W.him()}`)
    compileUnknownMacro(macro) {
        // TODO possible code:
        //  - macro call, W.macro(arg1, arg2)
        //  - macro call with unparsed args, W.macro("arg1 arg2")
        //  - inline, W.print(macro(arg1, arg2))
        //  - raw, W.print("<<macro arg1 arg2>>")
        // if 'macro call'
        // let args = parseArgs(macro.argString).map(argToCode);
        // this.writeCall(`W${this.mkAccessor(macro.name)}`, ...args);
        // if 'raw'
        this.wikifyHere(wikiWrite(macro), true);
    }
    compileMacro(macro) {
        let decl = this.knownMacros[macro.name];
        if (!decl) {
            this.compileUnknownMacro(macro);
            return;
        }
        let macroCallArgs = decl.skipArgs
            ? []
            : parseArgs(macro.argString, this.inputName + " <<" + macro.name + ">>", macro.line);
        decl.handler(this, macro, ...macroCallArgs);
    }
}
function nobrstring(s) {
    return s.replace(/\s+/g, ' ');
}
//# sourceMappingURL=WidgetCompiler.js.map