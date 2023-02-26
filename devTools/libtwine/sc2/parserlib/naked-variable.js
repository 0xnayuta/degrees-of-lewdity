"use strict";
/*
 * Created by aimozg on 08.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PDNakedVariable = void 0;
const patterns_js_1 = require("../../patterns.js");
const tokens_js_1 = require("../tokens.js");
const reNakedVariable = `${patterns_js_1.default.variable}(?:(?:\\.${patterns_js_1.default.identifier})|(?:\\[\\d+\\])|(?:\\["(?:\\\\.|[^"\\\\])+"\\])|(?:\\['(?:\\\\.|[^'\\\\])+'\\])|(?:\\[${patterns_js_1.default.variable}\\]))*`;
function* lexNakedVariable() {
    this.pos = this.nextMatch;
    yield this.token(tokens_js_1.WikiTokenType.NakedVariable);
}
exports.PDNakedVariable = {
    re: reNakedVariable,
    handler: lexNakedVariable
};
//# sourceMappingURL=naked-variable.js.map