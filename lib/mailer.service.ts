/** Dependencies **/
import { get } from "lodash";
///@ts-ignore
import { Injectable, Inject } from "@nestjs/common";
import {
  createTransport,
  createTestAccount,
  SentMessageInfo,
  Transporter,
  getTestMessageUrl,
  TestAccount
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
  private templateAdapter: TemplateAdapter;

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
    this.templateAdapter = get(this.mailerOptions, "template.adapter");

    if (this.templateAdapter) {
      this.transporter.use("compile", (mail, callback) => {
        if (mail.data.html) {
          return callback();
        }

        return this.templateAdapter.compile(mail, callback, this.mailerOptions);
      });
    }

    if (mailerOptions.enablePreviewing)
      this.enablePreviewing()
        .then()
        .catch(err => {
          throw err;
        });
  }

  public async enablePreviewing() {
    if (!this.mailerOptions.enablePreviewing) {
      this.mailerOptions.enablePreviewing = true;
      let account: TestAccount;
      try {
        account = await createTestAccount();
      } catch (err) {
        throw new Error(
          "Couldn't enable preview, an error occured - " + err.message
        );
      }

      this.previewTransporter = createTransport(
        {
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass
          }
        },
        this.mailerOptions.defaults
      );

      if (this.templateAdapter) {
        this.previewTransporter.use("compile", (mail, callback) => {
          if (mail.data.html) {
            return callback();
          }

          let compiled = this.templateAdapter.compile(
            mail,
            callback,
            this.mailerOptions
          );
          return compiled;
        });
      }
    }
  }

  public async sendMail(
    sendMailOptions: ISendMailOptions,
    preview: boolean = false
  ): Promise<SentMessageInfo> {
    if (preview) {
      if (!this.mailerOptions.enablePreviewing) {
        throw new Error(
          "Previewing is not currently enabled, enable it during initialization or with enablePreviewing()"
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
