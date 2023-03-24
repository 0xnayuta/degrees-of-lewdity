"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMWidget = void 0;
const MacroArgParser_js_1 = require("../../sc2/MacroArgParser.js");
exports.KMWidget = {};
// <<widget>>
exports.KMWidget["widget"] = {
    block: true,
    handler(compiler, tWidget) {
        if (compiler.context.widget) {
            compiler.throwError("Nested widget <<" + tWidget.name + ">> inside <<" + compiler.context.widget + ">>", tWidget.line);
        }
        // Parse widget name
        let widgetDeclArgs = (0, MacroArgParser_js_1.parseArgs)(tWidget.argString, compiler.inputName + " <<widget>>", tWidget.line);
        let widgetName = widgetDeclArgs[0].text;
        let oldOutputMode = compiler.context;
        compiler.context.widget = widgetName;
        compiler.output = 'wprint';
        compiler.indent(`W${compiler.mkAccessor(widgetName)} = function() {`);
        let localVarPos = compiler.rememberPos();
        if (compiler.options.trimWidgetNewlines) {
            let i = 0; // first non-newline content
            let j = tWidget.body.length - 1; // last non-newline content
            while (i < tWidget.body.length) {
                let item = tWidget.body[i];
                if (!(item.type === "entity" && item.subtype === "br" && item.val === "\n"))
                    break;
                i++;
            }
            while (j > i) {
                let item = tWidget.body[j];
                if (!(item.type === "entity" && item.subtype === "br" && item.val === "\n"))
                    break;
                j--;
            }
            compiler.compileAll(tWidget.body.slice(i, j + 1));
        }
        else {
            compiler.compileAll(tWidget.body);
        }
        compiler.unindent('};');
        compiler.extractLocalVars(localVarPos);
        compiler.output = oldOutputMode;
        compiler.context.widget = undefined;
    }
};
//# sourceMappingURL=widget.js.map