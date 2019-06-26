import Liquid from "liquidjs";
/** Interfaces **/
import { MailerOptions } from "../interfaces/mailer-options.interface";
import { TemplateAdapter } from "../interfaces/template-adapter.interface";
export declare class LiquidAdapter implements TemplateAdapter {
    engine: Liquid;
    compile(mail: any, callback: any, mailerOptions: MailerOptions): void;
}
