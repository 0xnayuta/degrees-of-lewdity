"use strict";
/*
 * Created by aimozg on 14.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMDisplay = void 0;
////////////////////
// Display Macros //
////////////////////
// <<=>>, <<print>>
const _utils_js_1 = require("./_utils.js");
exports.KMDisplay = {};
exports.KMDisplay["print"] = {
    skipArgs: true,
    handler(compiler, macro) {
        compiler.writePrint(compiler.mkTwinescript(macro.argString), true);
    }
};
exports.KMDisplay["="] = exports.KMDisplay["print"];
// <<->>
exports.KMDisplay["-"] = {
    skipArgs: true,
    handler(compiler, macro) {
        compiler.writePrintRaw(compiler.mkTwinescript(macro.argString), true);
    }
};
// TODO <<include>>
exports.KMDisplay["include"] = (0, _utils_js_1.builtinMacro)("call");
// <<nobr>>
exports.KMDisplay["nobr"] = {
    skipArgs: true,
    handler(compiler, macro) {
        let oldNobr = compiler.options.nobr;
        compiler.options.nobr = true;
        compiler.compileAll(macro.body);
        compiler.options.nobr = oldNobr;
    }
};
// <<silently>>
exports.KMDisplay["silently"] = {
    skipArgs: true,
    handler(compiler, macro) {
        let oldOutput = compiler.output;
        compiler.output = "ignore";
        compiler.writeCall('W.silently', 'true');
        compiler.compileAll(macro.body);
        compiler.writeCall("W.silently");
        compiler.output = oldOutput;
    }
};
// TODO <<type>>
exports.KMDisplay["type"] = (0, _utils_js_1.builtinMacro)("block");
//# sourceMappingURL=display.js.map