import nodemailer, { SentMessageInfo } from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
    service: process.env.MAILER_SERVICE,
    auth: {
        user: process.env.MAILER_EMAIL,
        pass: process.env.MAILER_SECRET_KEY
    }
})

export const sendEmail = async (options: { nombre: string, correoElectronico: string, content: string }):Promise<SentMessageInfo> => {

    const {nombre: subject, correoElectronico: replyTo, content: html} = options;
    
   try {
    const dataToSend = await transporter.sendMail({
        from: `osmanjosue007@gmail.com <osmanherrera.dev>`,
        to: 'osmanjosue007@gmail.com',
        replyTo,
        subject,
        html
    });
    return dataToSend;
   }
   catch(error){
    return error;
   }
}
