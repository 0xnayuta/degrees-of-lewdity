"use strict";
/*
 * Created by aimozg on 04.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KnownMacros = void 0;
const widget_js_1 = require("./macrolib/widget.js");
const variables_js_1 = require("./macrolib/variables.js");
const script_js_1 = require("./macrolib/script.js");
const dom_js_1 = require("./macrolib/dom.js");
const display_js_1 = require("./macrolib/display.js");
const control_js_1 = require("./macrolib/control.js");
const interactive_js_1 = require("./macrolib/interactive.js");
const links_js_1 = require("./macrolib/links.js");
const audio_js_1 = require("./macrolib/audio.js");
const misc_js_1 = require("./macrolib/misc.js");
exports.KnownMacros = {
    ...variables_js_1.KMVariables,
    ...script_js_1.KMScript,
    ...display_js_1.KMDisplay,
    ...control_js_1.KMControl,
    ...interactive_js_1.KMInteractive,
    ...links_js_1.KMLinks,
    ...dom_js_1.KMDOM,
    ...audio_js_1.KMAudio,
    ...misc_js_1.KMMisc,
    ...widget_js_1.KMWidget,
};
//# sourceMappingURL=macrolib.js.map