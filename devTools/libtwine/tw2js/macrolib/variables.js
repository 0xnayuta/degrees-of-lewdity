"use strict";
/*
 * Created by aimozg on 13.10.2022.
 */
//////////////////////
// Variables Macros //
//////////////////////
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMVariables = void 0;
const patterns_js_1 = require("../../patterns.js");
exports.KMVariables = {};
exports.KMVariables["capture"] = {
    block: true,
    skipArgs: true,
    handler(compiler, macro) {
        const tsVarRe = new RegExp(`(${patterns_js_1.default.variable})`, 'g');
        if (macro.argString.length === 0) {
            compiler.throwError('no story/temporary variable list specified', macro.line);
        }
        let captureList = [];
        for (let match of macro.argString.matchAll(tsVarRe)) {
            captureList.push(match[0]);
        }
        // <<capture $x _y>> =>
        // W.capture(["$x", "_y"], ()=>{ ... } );
        let captureLiteral = `[` + captureList.map(compiler.mkLiteral).join(', ') + ']';
        compiler.indent(`W.capture(${captureLiteral}, ()=>{`);
        compiler.compileAll(macro.body);
        compiler.unindent(`});`);
    }
};
// <<set>>, <<run>>
exports.KMVariables["set"] = {
    skipArgs: true,
    handler(compiler, macro) {
        compiler.write(compiler.mkTwinescript(macro.argString) + ";");
    }
};
// <<run>> - see <<set>>
exports.KMVariables["run"] = exports.KMVariables["set"];
// <<unset>>
exports.KMVariables["unset"] = {
    skipArgs: true,
    handler(compiler, macro) {
        const jsVarRe = new RegExp(
        // `State\\.(variables|temporary)\\.(${Patterns.identifier})`,
        `([VT])\\.(${patterns_js_1.default.identifier})`, 'g');
        let argString = compiler.mkTwinescript(macro.argString);
        if (argString.length === 0) {
            compiler.throwError('no story/temporary variable list specified', macro.line);
            return;
        }
        let match;
        while ((match = jsVarRe.exec(argString)) !== null) {
            const store = match[1];
            const name = match[2];
            if (store === 'V' && name.startsWith('_') && compiler.options.localVars) {
                compiler.write(`${compiler.localVarName(name.slice(1))} = undefined;`);
            }
            else {
                compiler.write(`delete ${store}${compiler.mkAccessor(name)};`);
            }
        }
    }
};
//# sourceMappingURL=variables.js.map