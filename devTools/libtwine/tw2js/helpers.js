"use strict";
/*
 * Created by aimozg on 18.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.evalText = exports.evalPassageId = void 0;
const twinescript_js_1 = require("../sc2/twinescript.js");
const patterns_js_1 = require("../patterns.js");
function evalPassageId(link) {
    return evalText(link);
}
exports.evalPassageId = evalPassageId;
const reSmellsLikeExpression = new RegExp('^(?:' +
    patterns_js_1.default.variable + '|' +
    '".*".*|' +
    // '\'.*\'.*|'+
    // '`.*`.*'+
    ')$');
// new RegExp('^'+Patterns.tsCode+'$');
const reIsLiteral = /^(?:"(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)$/;
/**
 * Given text = `plain text` or `$some + $expression` try to guess which one it is and return JS code
 */
function evalText(text) {
    // return JSON.stringify(text);
    if (reSmellsLikeExpression.test(text) || reIsLiteral.test(text)) {
        return (0, twinescript_js_1.parseTwineScript)(text);
    }
    else {
        return JSON.stringify(text);
    }
}
exports.evalText = evalText;
//# sourceMappingURL=helpers.js.map