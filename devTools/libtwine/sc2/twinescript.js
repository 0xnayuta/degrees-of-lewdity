"use strict";
/*
 * Created by aimozg on 03.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseTwineScript = void 0;
const patterns_js_1 = require("../patterns.js");
const utils_js_1 = require("../utils.js");
const tokenTable = Object.freeze({
    /* eslint-disable quote-props */
    // TODO @aimozg This should be a compiler option
    // Story $variable sigil-prefix.
    '$': 'V.',
    //'$'     : 'State.variables.',
    // Temporary _variable sigil-prefix.
    '_': 'T.',
    //'_'     : 'State.temporary.',
    // Assignment operators.
    'to': '=',
    // Equality operators.
    'eq': '==',
    'neq': '!=',
    'is': '===',
    'isnot': '!==',
    // Relational operators.
    'gt': '>',
    'gte': '>=',
    'lt': '<',
    'lte': '<=',
    // Logical operators.
    'and': '&&',
    'or': '||',
    // Unary operators.
    'not': '!',
    'def': '"undefined" !== typeof',
    'ndef': '"undefined" === typeof'
    /* eslint-enable quote-props */
});
const parseRe = new RegExp([
    '(?:""|\'\'|``)',
    '(?:"(?:\\\\.|[^"\\\\])+")',
    "(?:'(?:\\\\.|[^'\\\\])+')",
    '(`(?:\\\\.|[^`\\\\])+`)',
    '(?:[=+\\-*\\/%<>&\\|\\^~!?:,;\\(\\)\\[\\]{}]+)',
    '([^"\'=+\\-*\\/%<>&\\|\\^~!?:,;\\(\\)\\[\\]{}\\s]+)' // 2=Barewords
].join('|'), 'g');
const notSpaceRe = /\S/;
const varTest = new RegExp(`^${patterns_js_1.default.variable}`);
const withColonTestRe = /^\s*:/;
const withNotTestRe = /^\s+not\b/;
function parseTwineScript(rawCodeString) {
    if (parseRe.lastIndex !== 0) {
        throw new RangeError('parseTwineScript last index is non-zero at start');
    }
    let code = rawCodeString;
    let match;
    while ((match = parseRe.exec(code)) !== null) {
        // no-op: Empty quotes | Double quoted | Single quoted | Operator delimiters
        // Template literal, non-empty.
        if (match[1]) {
            const rawTemplate = match[1];
            const parsedTemplate = parseTemplate(rawTemplate);
            if (parsedTemplate !== rawTemplate) {
                code = (0, utils_js_1.strsplice)(code, match.index, // starting index
                rawTemplate.length, // replace how many
                parsedTemplate // replacement string
                );
                parseRe.lastIndex += parsedTemplate.length - rawTemplate.length;
            }
        }
        // Barewords.
        else if (match[2]) {
            let token = match[2];
            // If the token is simply a dollar-sign or underscore, then it's either
            // just the raw character or, probably, a function alias, so skip it.
            if (token === '$' || token === '_') {
                continue;
            }
            // If the token is a story $variable or temporary _variable, reset it
            // to just its sigil—for later mapping.
            else if (varTest.test(token)) {
                token = token[0];
            }
            // If the token is `is`, check to see if it's followed by `not`, if so,
            // convert them into the `isnot` operator.
            //
            // NOTE: This is a safety feature, since `$a is not $b` probably sounds
            // reasonable to most users.
            else if (token === 'is') {
                const start = parseRe.lastIndex;
                const ahead = code.slice(start);
                if (withNotTestRe.test(ahead)) {
                    code = (0, utils_js_1.strsplice)(code, start, ahead.search(notSpaceRe));
                    token = 'isnot';
                }
            }
            // If the token is followed by a colon, then it's likely to be an object
            // property, so skip it.
            else {
                const ahead = code.slice(parseRe.lastIndex);
                if (withColonTestRe.test(ahead)) {
                    continue;
                }
            }
            // If the finalized token has a mapping, replace it within the code string
            // with its counterpart.
            if (tokenTable[token]) {
                code = (0, utils_js_1.strsplice)(code, match.index, // starting index
                token.length, // replace how many
                tokenTable[token] // replacement string
                );
                parseRe.lastIndex += tokenTable[token].length - token.length;
            }
        }
    }
    return code;
}
exports.parseTwineScript = parseTwineScript;
const templateGroupStartRe = /\$\{/g;
const templateGroupParseRe = new RegExp([
    '(?:""|\'\')',
    '(?:"(?:\\\\.|[^"\\\\])+")',
    "(?:'(?:\\\\.|[^'\\\\])+')",
    '(\\{)',
    '(\\})' // 2=Closing curly brace
].join('|'), 'g');
function parseTemplate(rawTemplateLiteral) {
    if (templateGroupStartRe.lastIndex !== 0) {
        throw new RangeError('Scripting.parse last index is non-zero at start of template literal');
    }
    let template = rawTemplateLiteral;
    let startMatch;
    while ((startMatch = templateGroupStartRe.exec(template)) !== null) {
        const startIdx = startMatch.index + 2;
        let endIdx = startIdx;
        let depth = 1;
        let endMatch;
        templateGroupParseRe.lastIndex = startIdx;
        while ((endMatch = templateGroupParseRe.exec(template)) !== null) {
            // Opening curly brace.
            if (endMatch[1]) {
                ++depth;
            }
            // Closing curly brace.
            else if (endMatch[2]) {
                --depth;
            }
            if (depth === 0) {
                endIdx = endMatch.index;
                break;
            }
        }
        // If the group is not empty, replace it within the template
        // with its parsed counterpart.
        if (endIdx > startIdx) {
            const parseIndex = parseRe.lastIndex;
            const rawGroup = template.slice(startIdx, endIdx);
            parseRe.lastIndex = 0;
            const parsedGroup = parseTwineScript(rawGroup);
            parseRe.lastIndex = parseIndex;
            template = (0, utils_js_1.strsplice)(template, startIdx, // starting index
            rawGroup.length, // replace how many
            parsedGroup // replacement string
            );
            templateGroupStartRe.lastIndex += parsedGroup.length - rawGroup.length;
        }
    }
    return template;
}
//# sourceMappingURL=twinescript.js.map