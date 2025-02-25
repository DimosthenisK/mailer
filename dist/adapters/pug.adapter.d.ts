/** Interfaces **/
import { MailerOptions } from '../interfaces/mailer-options.interface';
import { TemplateAdapter } from '../interfaces/template-adapter.interface';
export declare class PugAdapter implements TemplateAdapter {
    compile(mail: any, callback: any, mailerOptions: MailerOptions): void;
}
