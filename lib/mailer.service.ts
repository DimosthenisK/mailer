/** Dependencies **/
import { get } from "lodash";
///@ts-ignore
import { Injectable, Inject } from "@nestjs/common";
import {
  createTransport,
  createTestAccount,
  SentMessageInfo,
  Transporter,
  getTestMessageUrl
} from "nodemailer";

/** Constants **/
import { MAILER_OPTIONS } from "./constants/mailer-options.constant";

/** Interfaces **/
import { MailerOptions } from "./interfaces/mailer-options.interface";
import { TemplateAdapter } from "./interfaces/template-adapter.interface";
import { ISendMailOptions } from "./interfaces/send-mail-options.interface";

@Injectable()
export class MailerService {
  private transporter: Transporter;
  private previewTransporter: Transporter;

  constructor(
    @Inject(MAILER_OPTIONS) private readonly mailerOptions: MailerOptions
  ) {
    if (
      !mailerOptions.transport ||
      Object.keys(mailerOptions.transport).length <= 0
    ) {
      throw new Error(
        "Make sure to provide a nodemailer transport configuration object, connection url or a transport plugin instance."
      );
    }

    /** Transporter setup **/
    this.transporter = createTransport(
      this.mailerOptions.transport,
      this.mailerOptions.defaults
    );

    /** Adapter setup **/
    const templateAdapter: TemplateAdapter = get(
      this.mailerOptions,
      "template.adapter"
    );

    if (templateAdapter) {
      this.transporter.use("compile", (mail, callback) => {
        if (mail.data.html) {
          return callback();
        }

        return templateAdapter.compile(mail, callback, this.mailerOptions);
      });
    }

    if (mailerOptions.enablePreviewing)
      //test transporter setup
      createTestAccount((err, account) => {
        if (err) {
          throw new Error(
            "Couldn't enable preview, an error occured - " + err.message
          );
        }

        this.previewTransporter = createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        });
      });
  }

  public async sendMail(
    sendMailOptions: ISendMailOptions,
    preview: boolean = false
  ): Promise<SentMessageInfo> {
    if (preview) {
      if (!this.mailerOptions.enablePreviewing) {
        throw new Error(
          "Previewing is not currently enabled, enable it during initialization"
        );
      }
      let mailInfo = await this.previewTransporter.sendMail(sendMailOptions);
      return {
        mailInfo,
        previewUrl: getTestMessageUrl(mailInfo)
      };
    }
    return await this.transporter.sendMail(sendMailOptions);
  }
}
