/** Dependencies **/
import * as path from "path";
import { get } from "lodash";
import Liquid, * as liq from "liquidjs";

/** Interfaces **/
import { MailerOptions } from "../interfaces/mailer-options.interface";
import { TemplateAdapter } from "../interfaces/template-adapter.interface";

export class LiquidAdapter implements TemplateAdapter {
  public engine: Liquid;

  public compile(mail: any, callback: any, mailerOptions: MailerOptions): void {
    const templateDir =
      path.dirname(mail.data.template) !== "."
        ? path.dirname(mail.data.template)
        : get(mailerOptions, "template.dir", "");

    if (!this.engine)
      this.engine = new Liquid({ root: templateDir, extname: ".liquid" });

    this.engine
      .renderFile(
        mail.data.template,
        mail.data.context,
        get(mailerOptions, "template.options", {})
      )
      .then(body => {
        mail.data.html = body;
        return callback();
      })
      .catch(err => {
        return callback(err);
      });
  }
}
