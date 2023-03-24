"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.compilePassage = exports.compileWidgets = void 0;
/*
 * Created by aimozg on 03.10.2022.
 */
const macrolib_js_1 = require("./macrolib.js");
const SugarCubeCompiler_js_1 = require("./SugarCubeCompiler.js");
function compileWidgets(content, options) {
    let compiler = new SugarCubeCompiler_js_1.SugarCubeCompiler(options);
    compiler.registerMacroLibrary(macrolib_js_1.KnownMacros);
    compiler.compileAll(content);
    if (compiler.isEmpty())
        return '';
    // let prefix = 'if (typeof W === "undefined") window.W = {};\n';
    // return prefix + compiler.buildSources();
    return compiler.buildSources();
}
exports.compileWidgets = compileWidgets;
function compilePassage(passageName, content, options) {
    let compiler = new SugarCubeCompiler_js_1.SugarCubeCompiler(options);
    compiler.registerMacroLibrary(macrolib_js_1.KnownMacros);
    compiler.compilePassage(passageName, content);
    if (compiler.isEmpty())
        return '';
    return compiler.buildSources();
}
exports.compilePassage = compilePassage;
//# sourceMappingURL=tw2js.js.map