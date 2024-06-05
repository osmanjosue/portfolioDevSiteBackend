import { Request, Response } from "express";
import { sendEmail } from "../services/sendEmail.service";
import { NodeMailerResponse } from "../interfaces/nodeMailerResponse.interface";

export const sendEmailController = async (req: Request, res: Response) => {
    const { ...emailData } = req.body;

    try {
        const emailBody = await sendEmail(emailData)
        if (emailBody.rejected.length === 0) {
            return res.status(202).json({ //202: Accepted
                ok: true,
                msg: 'Correo enviado exitosamente',
                emailBody
            });
        }
        else {
            console.log({ Aceptados: emailBody.accepted })
            console.log({ Rechazados: emailBody.rejected })
            throw new Error('Error al enviar correo')
        }
    }

    catch (err) {
        console.log(err);
        return res.status(400).json({
            ok: false,
            msg: 'Error al enviar el correo',
        })

    }
}