import { SentMessageInfo } from "nodemailer";
/** Interfaces **/
import { MailerOptions } from "./interfaces/mailer-options.interface";
import { ISendMailOptions } from "./interfaces/send-mail-options.interface";
export declare class MailerService {
    private readonly mailerOptions;
    private transporter;
    private previewTransporter;
    private templateAdapter;
    constructor(mailerOptions: MailerOptions);
    enablePreviewing(): Promise<void>;
    sendMail(sendMailOptions: ISendMailOptions, preview?: boolean): Promise<SentMessageInfo>;
}
