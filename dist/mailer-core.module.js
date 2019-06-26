"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var MailerCoreModule_1;
Object.defineProperty(exports, "__esModule", { value: true });
///@ts-ignore
const common_1 = require("@nestjs/common");
/** Constants **/
const mailer_options_constant_1 = require("./constants/mailer-options.constant");
/** Services **/
const mailer_service_1 = require("./mailer.service");
let MailerCoreModule = MailerCoreModule_1 = class MailerCoreModule {
    static forRoot(options) {
        const MailerOptionsProvider = {
            name: mailer_options_constant_1.MAILER_OPTIONS,
            provide: mailer_options_constant_1.MAILER_OPTIONS,
            useValue: options
        };
        return {
            module: MailerCoreModule_1,
            providers: [
                /** Options **/
                MailerOptionsProvider,
                /** Services **/
                mailer_service_1.MailerService
            ],
            exports: [
                /** Services **/
                mailer_service_1.MailerService
            ]
        };
    }
    static forRootAsync(options) {
        const providers = this.createAsyncProviders(options);
        return {
            module: MailerCoreModule_1,
            providers: [
                /** Providers **/
                ...providers,
                /** Services **/
                mailer_service_1.MailerService
            ],
            imports: options.imports,
            exports: [
                /** Services **/
                mailer_service_1.MailerService
            ]
        };
    }
    static createAsyncProviders(options) {
        const providers = [this.createAsyncOptionsProvider(options)];
        if (options.useClass) {
            providers.push({
                provide: options.useClass,
                useClass: options.useClass
            });
        }
        return providers;
    }
    static createAsyncOptionsProvider(options) {
        if (options.useFactory) {
            return {
                name: mailer_options_constant_1.MAILER_OPTIONS,
                provide: mailer_options_constant_1.MAILER_OPTIONS,
                useFactory: options.useFactory,
                inject: options.inject || []
            };
        }
        return {
            name: mailer_options_constant_1.MAILER_OPTIONS,
            provide: mailer_options_constant_1.MAILER_OPTIONS,
            useFactory: (optionsFactory) => __awaiter(this, void 0, void 0, function* () {
                return optionsFactory.createMailerOptions();
            }),
            inject: [options.useExisting || options.useClass]
        };
    }
};
MailerCoreModule = MailerCoreModule_1 = __decorate([
    common_1.Global(),
    common_1.Module({})
], MailerCoreModule);
exports.MailerCoreModule = MailerCoreModule;
//# sourceMappingURL=mailer-core.module.js.map