import { SentMessageInfo } from "nodemailer";
/** Interfaces **/
import { MailerOptions } from "./interfaces/mailer-options.interface";
import { ISendMailOptions } from "./interfaces/send-mail-options.interface";
export declare class MailerService {
    private readonly mailerOptions;
    private transporter;
    private previewTransporter;
    constructor(mailerOptions: MailerOptions);
    sendMail(sendMailOptions: ISendMailOptions, preview?: boolean): Promise<SentMessageInfo>;
}
