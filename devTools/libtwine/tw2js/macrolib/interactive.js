"use strict";
/*
 * Created by aimozg on 14.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMInteractive = void 0;
////////////////////////
// Interactive Macros //
////////////////////////
// TODO <<button>>
const _utils_js_1 = require("./_utils.js");
const MacroArgParser_js_1 = require("../../sc2/MacroArgParser.js");
exports.KMInteractive = {};
// <<button>>, <<link>>
exports.KMInteractive["button"] = {
    block: true,
    handler(compiler, macro, arg1, arg2) {
        if (!arg1) {
            compiler.throwError(`no ${macro.name} text specified`);
            return;
        }
        // W.button(arg1, arg2, ()=>{body})
        let cArgs = (typeof arg2 === 'undefined') ? (0, MacroArgParser_js_1.argToCode)(arg1, compiler.inputName) : ((0, MacroArgParser_js_1.argToCode)(arg1, compiler.inputName) + ', ' + (0, MacroArgParser_js_1.argToCode)(arg2, compiler.inputName));
        if (macro.body.length === 0) {
            compiler.write(`W.${macro.name}(${cArgs});`);
        }
        else {
            compiler.indent(`W.${macro.name}(${cArgs}, ()=>{`);
            compiler.compileAll(macro.body);
            compiler.unindent(`});`);
        }
    }
};
exports.KMInteractive["link"] = exports.KMInteractive["button"];
// TODO <<checkbox>>, <<option>>, <<optionsfrom>>
exports.KMInteractive["checkbox"] = (0, _utils_js_1.builtinMacro)("print");
exports.KMInteractive["optionsfrom"] = (0, _utils_js_1.builtinMacro)("print", true);
// TODO <<cycle>>
exports.KMInteractive["cycle"] = (0, _utils_js_1.builtinMacro)("block");
// TODO <<linkappend>>
exports.KMInteractive["linkappend"] = (0, _utils_js_1.builtinMacro)("block");
// TODO <<linkprepend>>
exports.KMInteractive["linkprepend"] = (0, _utils_js_1.builtinMacro)("block");
// TODO <<linkreplace>>
exports.KMInteractive["linkreplace"] = (0, _utils_js_1.builtinMacro)("block");
// TODO <<listbox>>, <<option>>, <<optionsfrom>>
exports.KMInteractive["listbox"] = (0, _utils_js_1.builtinMacro)("print");
// TODO <<numberbox>>
exports.KMInteractive["numberbox"] = (0, _utils_js_1.builtinMacro)("print");
// TODO <<radiobutton>>
exports.KMInteractive["radiobutton"] = (0, _utils_js_1.builtinMacro)("print");
// TODO <<textarea>>
exports.KMInteractive["textarea"] = (0, _utils_js_1.builtinMacro)("print");
// TODO <<textbox>>
exports.KMInteractive["textbox"] = (0, _utils_js_1.builtinMacro)("print");
//# sourceMappingURL=interactive.js.map