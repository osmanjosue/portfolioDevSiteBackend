import nodemailer, { SentMessageInfo } from 'nodemailer';
import 'dotenv/config';
import { EmailAttachment } from '../interfaces/email.interface';
import { lista } from './listaDeCorreos';

const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
    }
})

export const sendEmail = async (options: { nombre: string, correoElectronico: string, content: string, attachments?: EmailAttachment[] | undefined}):Promise<SentMessageInfo> => {

    const {nombre: subject, correoElectronico: replyTo, content: html, attachments = []} = options;
    
   try {
    const dataToSend = await transporter.sendMail({
        from: `osmanherrera.dev <osmanherrera.dev>`,
        to: ['osmanjosue007@gmail.com'],
        /* from: `Samantha Patschke <samantha_patschke@proyectoproposito.org>`,
        to: [''], */
        bcc: lista,
        replyTo,
        subject,
        html,
        attachments
    });
    return dataToSend;
   }
   catch(error){
    return error;
   }
}
