"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
require("dotenv/config");
// import { lista } from './listaDeCorreos';
const transporter = nodemailer_1.default.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
    }
});
const sendEmail = (options) => __awaiter(void 0, void 0, void 0, function* () {
    const { nombre: subject, correoElectronico: replyTo, content: html, attachments = [] } = options;
    try {
        const dataToSend = yield transporter.sendMail({
            from: `osmanherrera.dev <osmanherrera.dev>`,
            to: ['osmanjosue007@gmail.com'],
            replyTo,
            subject,
            html,
            attachments
        });
        return dataToSend;
    }
    catch (error) {
        return error;
    }
});
exports.sendEmail = sendEmail;
