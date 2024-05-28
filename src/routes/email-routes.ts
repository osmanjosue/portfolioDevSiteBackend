import { Router } from 'express';
import { check } from 'express-validator';
import { sendEmailController } from '../controllers/sendEmail-controller';
import { validarCampos } from '../middlewares/validarCampos';

const router = Router()

router.post('/',
    [
        check('nombre', 'El destinatario es necesario').notEmpty(), //nombre
        check('correoElectronico', 'El correo de contacto es obligatorio').notEmpty().isEmail(),//correo
        check('content', 'El cuerpo html es necesario').notEmpty(),
        validarCampos
    ],
    sendEmailController,
);

module.exports= router