"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.builtinMacro = exports.notImplementedMacro = void 0;
const WikiWriter_js_1 = require("../../sc2/WikiWriter.js");
const MacroArgParser_js_1 = require("../../sc2/MacroArgParser.js");
/*
 * Created by aimozg on 13.10.2022.
 */
function notImplementedMacro(block = false) {
    return {
        block,
        handler(compiler, macro) {
            compiler.throwError("Macro <<" + macro.name + ">> not implemented", macro.line);
        }
    };
}
exports.notImplementedMacro = notImplementedMacro;
/**
 * mode = "print": `<<foo $arg>>` -> `W.print("<<foo $arg>>")`
 *
 * mode = "block": `<<foo $arg>>body<</macro>>` -> `W.print("<<foo $arg>>body<</macro>>")`
 *
 * mode = "call": `<<foo $arg>>` -> `W.foo(V.arg)`
 *
 * mode = "blockcall": `<<foo $arg>>body<</macro>>` -> `W.foo([V.arg], "body")`
 *
 * mode = "blockfn": `<<foo $arg>>body<</macro>>` -> `W.foo([V.arg], ()=>{ W.print("body") })`
 *
 * mode = "$container": `<<foo $arg>>body<</macro>>` -> `W.$container("foo", [V.arg], ()=>{ W.print("body") })`
 */
function builtinMacro(
// TODO @aimozg Cleanup, remove unused
mode, skipArgs = false) {
    return {
        block: mode === "block",
        skipArgs: skipArgs,
        handler(compiler, macro, ...args) {
            switch (mode) {
                case "block":
                case "print":
                    compiler.wikifyHere((0, WikiWriter_js_1.wikiWrite)(macro), true);
                    break;
                case "call":
                    compiler.compileMacroCall(macro.name, args.map(a => (0, MacroArgParser_js_1.argToCode)(a, compiler.inputName)));
                    break;
                case "blockcall":
                    compiler.compileMacroBlockCall(macro.name, args.map(a => (0, MacroArgParser_js_1.argToCode)(a, compiler.inputName)), (0, WikiWriter_js_1.wikiWriteAll)(macro.body));
                    break;
                case "blockfn":
                    compiler.compileMacroBlockFn(macro.name, args.map(a => (0, MacroArgParser_js_1.argToCode)(a, compiler.inputName)), macro.body);
                    break;
                case "$container":
                    compiler.compileUnknownContainerMacro(macro.name, args.map(a => (0, MacroArgParser_js_1.argToCode)(a, compiler.inputName)), macro.body);
            }
        }
    };
}
exports.builtinMacro = builtinMacro;
//# sourceMappingURL=_utils.js.map