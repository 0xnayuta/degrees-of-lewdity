"use strict";
/*
 * Created by aimozg on 13.10.2022.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.KMScript = void 0;
const WikiWriter_js_1 = require("../../sc2/WikiWriter.js");
exports.KMScript = {};
exports.KMScript["script"] = {
    block: true,
    handler(compiler, macro) {
        compiler.indent(`W.script(()=>{`);
        compiler.write((0, WikiWriter_js_1.wikiWriteAll)(macro.body));
        compiler.unindent(`});`);
    }
};
//# sourceMappingURL=script.js.map