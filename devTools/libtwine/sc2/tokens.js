"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WikiTokenType = void 0;
var WikiTokenType;
(function (WikiTokenType) {
    WikiTokenType[WikiTokenType["Text"] = 0] = "Text";
    /** <<macro>> */
    WikiTokenType[WikiTokenType["Macro"] = 1] = "Macro";
    /** $variable */
    WikiTokenType[WikiTokenType["NakedVariable"] = 2] = "NakedVariable";
    /** all kinds of comment */
    WikiTokenType[WikiTokenType["Comment"] = 3] = "Comment";
    /** \n or <br> */
    WikiTokenType[WikiTokenType["LineBreak"] = 4] = "LineBreak";
    /** "<tag" */
    WikiTokenType[WikiTokenType["HtmlTagStart"] = 5] = "HtmlTagStart";
    /** attr="value" */
    WikiTokenType[WikiTokenType["HtmlTagAttr"] = 6] = "HtmlTagAttr";
    /** ">" or "/>" */
    WikiTokenType[WikiTokenType["HtmlTagEnd"] = 7] = "HtmlTagEnd";
    /** "</tag>*/
    WikiTokenType[WikiTokenType["HtmlTagClose"] = 8] = "HtmlTagClose";
})(WikiTokenType = exports.WikiTokenType || (exports.WikiTokenType = {}));
//# sourceMappingURL=tokens.js.map