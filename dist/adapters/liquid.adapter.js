"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/** Dependencies **/
const path = require("path");
const lodash_1 = require("lodash");
const liquidjs_1 = require("liquidjs");
class LiquidAdapter {
    compile(mail, callback, mailerOptions) {
        const templateDir = path.dirname(mail.data.template) !== "."
            ? path.dirname(mail.data.template)
            : lodash_1.get(mailerOptions, "template.dir", "");
        if (!this.engine)
            this.engine = new liquidjs_1.default({ root: templateDir, extname: ".liquid" });
        this.engine
            .renderFile(mail.data.template, mail.data.context, lodash_1.get(mailerOptions, "template.options", {}))
            .then(body => {
            mail.data.html = body;
            return callback();
        })
            .catch(err => {
            return callback(err);
        });
    }
}
exports.LiquidAdapter = LiquidAdapter;
//# sourceMappingURL=liquid.adapter.js.map