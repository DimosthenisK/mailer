/** Interfaces **/
import { MailerOptions } from '../interfaces/mailer-options.interface';
import { TemplateAdapter } from '../interfaces/template-adapter.interface';
export declare class HandlebarsAdapter implements TemplateAdapter {
    private precompiledTemplates;
    compile(mail: any, callback: any, mailerOptions: MailerOptions): void;
}
