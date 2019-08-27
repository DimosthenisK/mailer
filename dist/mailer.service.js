"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/** Dependencies **/
const lodash_1 = require("lodash");
///@ts-ignore
const common_1 = require("@nestjs/common");
const nodemailer_1 = require("nodemailer");
/** Constants **/
const mailer_options_constant_1 = require("./constants/mailer-options.constant");
let MailerService = class MailerService {
    constructor(mailerOptions) {
        this.mailerOptions = mailerOptions;
        if (!mailerOptions.transport ||
            Object.keys(mailerOptions.transport).length <= 0) {
            throw new Error("Make sure to provide a nodemailer transport configuration object, connection url or a transport plugin instance.");
        }
        /** Transporter setup **/
        this.transporter = nodemailer_1.createTransport(this.mailerOptions.transport, this.mailerOptions.defaults);
        /** Adapter setup **/
        this.templateAdapter = lodash_1.get(this.mailerOptions, "template.adapter");
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
    enablePreviewing() {
        return __awaiter(this, void 0, void 0, function* () {
            this.mailerOptions.enablePreviewing = true;
            let account;
            try {
                account = yield nodemailer_1.createTestAccount();
            }
            catch (err) {
                throw new Error("Couldn't enable preview, an error occured - " + err.message);
            }
            this.previewTransporter = nodemailer_1.createTransport({
                host: account.smtp.host,
                port: account.smtp.port,
                secure: account.smtp.secure,
                auth: {
                    user: account.user,
                    pass: account.pass
                }
            }, this.mailerOptions.defaults);
            if (this.templateAdapter) {
                this.previewTransporter.use("compile", (mail, callback) => {
                    if (mail.data.html) {
                        return callback();
                    }
                    let compiled = this.templateAdapter.compile(mail, callback, this.mailerOptions);
                    return compiled;
                });
            }
        });
    }
    sendMail(sendMailOptions, preview = false) {
        return __awaiter(this, void 0, void 0, function* () {
            if (preview) {
                if (!this.mailerOptions.enablePreviewing) {
                    throw new Error("Previewing is not currently enabled, enable it during initialization or with enablePreviewing()");
                }
                let mailInfo = yield this.previewTransporter.sendMail(sendMailOptions);
                return {
                    mailInfo,
                    previewUrl: nodemailer_1.getTestMessageUrl(mailInfo)
                };
            }
            return yield this.transporter.sendMail(sendMailOptions);
        });
    }
};
MailerService = __decorate([
    common_1.Injectable(),
    __param(0, common_1.Inject(mailer_options_constant_1.MAILER_OPTIONS)),
    __metadata("design:paramtypes", [Object])
], MailerService);
exports.MailerService = MailerService;
//# sourceMappingURL=mailer.service.js.map