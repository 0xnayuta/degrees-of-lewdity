"use strict";
/*
 * Created by aimozg on 08.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.AllParsersRegex = exports.ParserLib = void 0;
const macro_js_1 = require("./parserlib/macro.js");
const naked_variable_js_1 = require("./parserlib/naked-variable.js");
const line_break_js_1 = require("./parserlib/line-break.js");
const comment_js_1 = require("./parserlib/comment.js");
const html_tag_js_1 = require("./parserlib/html-tag.js");
exports.ParserLib = [
    // TODO quoteByBlock wiki parser
    // TODO quoteByLine wiki parser
    macro_js_1.PDMacro,
    // TODO link wiki parser
    // TODO urlLink wiki parser
    // TODO image wiki parser
    // TODO monospacedByBlock wiki parser
    // TODO formatByChar wiki parser
    // TODO customStyle wiki parser
    // TODO verbatimTet wiki parser
    // TODO horizontalRule wiki parser
    // TODO emdash wiki parser
    // TODO doubleDollarSign wiki parser
    naked_variable_js_1.PDNakedVariable,
    // TODO template wiki parser
    // TODO heading wiki parser
    // TODO table wiki parser
    // TODO list wiki parser
    comment_js_1.PDComment,
    // TODO lineContinuation wiki parser
    line_break_js_1.PDLineBreak,
    // TODO htmlCharacterReference wiki parser
    // TODO xmlProlog wiki parser
    // TODO verbatimHtml wiki parser
    // TODO verbatimScriptTag wiki parser
    // TODO styleTag wiki parser
    // TODO svgTag wiki parser
    html_tag_js_1.PDHtmlTag,
];
exports.AllParsersRegex = new RegExp(exports.ParserLib.map(s => '(' + s.re + ')').join('|'), 'gm');
//# sourceMappingURL=parserlib.js.map