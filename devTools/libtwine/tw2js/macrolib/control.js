"use strict";
/*
 * Created by aimozg on 14.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMControl = void 0;
////////////////////
// Control Macros //
////////////////////
const patterns_js_1 = require("../../patterns.js");
const twinescript_js_1 = require("../../sc2/twinescript.js");
const MacroArgParser_js_1 = require("../../sc2/MacroArgParser.js");
exports.KMControl = {};
exports.KMControl["if"] = {
    block: true,
    skipArgs: true,
    handler(compiler, tIf) {
        compiler.indent(`if (${compiler.mkTwinescript(tIf.argString)}) {`);
        compiler.compileAll(tIf.body, {
            "elseif": (compiler, tElseIf) => {
                compiler.writeUnindented(`} else if (${compiler.mkTwinescript(tElseIf.argString)}) {`);
            },
            "else": (compiler) => {
                compiler.writeUnindented("} else {");
            }
        });
        compiler.unindent('}');
    }
};
exports.KMControl["for"] = {
    block: true,
    skipArgs: true,
    handler(compiler, tFor) {
        const hasRangeRe = new RegExp(`^\\S${patterns_js_1.default.anyChar}*?\\s+range\\s+\\S${patterns_js_1.default.anyChar}*?$`);
        //const rangeRe     = new RegExp(`^(?:State\\.(variables|temporary)\\.(${Patterns.identifier})\\s*,\\s*)?State\\.(variables|temporary)\\.(${Patterns.identifier})\\s+range\\s+(\\S${Patterns.anyChar}*?)$`);
        const rangeRe = new RegExp(`^(?:([VT])\\.(${patterns_js_1.default.identifier})\\s*,\\s*)?([VT])\\.(${patterns_js_1.default.identifier})\\s+range\\s+(\\S${patterns_js_1.default.anyChar}*?)$`);
        const threePartRe = /^([^;]*?)\s*;\s*([^;]*?)\s*;\s*([^;]*?)$/;
        const forInRe = /^\S+\s+in\s+\S+/i;
        const forOfRe = /^\S+\s+of\s+\S+/i;
        let argsStr = (0, twinescript_js_1.parseTwineScript)(tFor.argString).trim();
        // TODO trim last \n
        let payload = tFor.body;
        function handleForTrue() {
            compiler.indent(`while (true) {`);
            compiler.compileAll(payload);
            compiler.unindent(`}`);
        }
        function handleFor(init, condition, post) {
            compiler.indent(`for (${init ?? ''}; ${condition ?? ''}; ${post ?? ''}) {`);
            compiler.compileAll(payload);
            compiler.unindent(`}`);
        }
        function handleForRange(indexVar, valueVar, rangeExp) {
            let cIndexVar = indexVar.name ? indexVar.type + compiler.mkAccessor(indexVar.name) : null;
            let cValueVar = valueVar.name ? valueVar.type + compiler.mkAccessor(valueVar.name) : null;
            if (cIndexVar && cValueVar) {
                compiler.indent(`for ([${cIndexVar}, ${cValueVar}] of W.$entries(${rangeExp})) {`);
            }
            else {
                compiler.indent(`for (${cValueVar} of W.$values(${rangeExp})) {`);
            }
            compiler.compileAll(payload);
            compiler.unindent('}');
        }
        // Empty form.
        if (argsStr.length === 0) {
            handleForTrue();
        }
        else if (hasRangeRe.test(argsStr)) {
            // Range form.
            const parts = argsStr.match(rangeRe);
            if (parts === null) {
                compiler.throwError('invalid range form syntax, format: [index ,] value range collection', tFor.line);
                return;
            }
            handleForRange({ type: parts[1], name: parts[2] }, { type: parts[3], name: parts[4] }, parts[5]);
        }
        else {
            // Conditional forms.
            let init;
            let condition;
            let post;
            // Conditional-only form.
            if (argsStr.indexOf(';') === -1) {
                // Sanity checks.
                if (forInRe.test(argsStr)) {
                    compiler.throwError('invalid syntax, for…in is not supported; see: for…range', tFor.line);
                    return;
                }
                else if (forOfRe.test(argsStr)) {
                    compiler.throwError('invalid syntax, for…of is not supported; see: for…range', tFor.line);
                    return;
                }
                condition = argsStr;
            }
            else {
                // 3-part conditional form.
                const parts = argsStr.match(threePartRe);
                if (parts === null) {
                    compiler.throwError('invalid 3-part conditional form syntax, format: [init] ; [condition] ; [post]', tFor.line);
                    return;
                }
                init = parts[1];
                condition = parts[2].trim();
                post = parts[3];
                if (condition.length === 0) {
                    condition = true;
                }
            }
            handleFor(init, condition, post);
        }
    }
};
exports.KMControl["break"] = {
    skipArgs: true,
    handler(compiler, tBreak) {
        if (tBreak.argString)
            compiler.throwError("<<break>> should not have args", tBreak.line);
        compiler.write("break;");
    }
};
exports.KMControl["continue"] = {
    skipArgs: true,
    handler(compiler, tContinue) {
        if (tContinue.argString)
            compiler.throwError("<<continue>> should not have args", tContinue.line);
        compiler.write("continue;");
    }
};
// <<switch>>, <<case>>, <<default>>
exports.KMControl["switch"] = {
    block: true,
    skipArgs: true,
    handler(compiler, tSwitch) {
        if (tSwitch.argString.length === 0) {
            compiler.throwError('no expression specified');
            return;
        }
        let ncases = 0, ndefault = 0;
        let oldOutputMode = compiler.output;
        compiler.output = "ignore"; // skip whitespace & text until first case
        compiler.indent(`switch(${compiler.mkTwinescript(tSwitch.argString)}) {`);
        compiler.indent();
        compiler.compileAll(tSwitch.body, {
            "case": (compiler, tCase) => {
                if (ndefault > 0) {
                    compiler.throwError('<<default>> must be the final case', tCase.line);
                }
                if (ncases > 0)
                    compiler.write("break;");
                let values = (0, MacroArgParser_js_1.parseArgs)(tCase.argString, compiler.inputName, tCase.line);
                if (values.length === 0) {
                    compiler.throwError(`no value(s) specified for <<case>> (#${ncases})`, tCase.line);
                }
                for (let value of values) {
                    compiler.writeUnindented(`case ${(0, MacroArgParser_js_1.argToCode)(value, compiler.inputName)}:`);
                }
                if (ncases === 0) {
                    compiler.output = oldOutputMode;
                }
                ncases++;
            },
            "default": (compiler, tDefault) => {
                if (ndefault > 0) {
                    compiler.throwError('<<default>> must be the final case', tDefault.line);
                }
                if (tDefault.argString.length > 0) {
                    compiler.throwError(`<<default>> does not accept values, invalid: ${tDefault.argString}`);
                }
                if (ncases > 0)
                    compiler.write("break;");
                compiler.writeUnindented("default:");
                if (ncases === 0) {
                    compiler.output = oldOutputMode;
                }
                ndefault++;
            }
        });
        compiler.unindent();
        compiler.unindent('}');
        if (ncases === 0 && ndefault === 0) {
            compiler.throwError('no cases specified', tSwitch.line);
            return;
        }
    }
};
//# sourceMappingURL=control.js.map