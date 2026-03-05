"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const sendEmail_controller_1 = require("../controllers/sendEmail-controller");
const validarCampos_1 = require("../middlewares/validarCampos");
const router = (0, express_1.Router)();
router.post('/', [
    (0, express_validator_1.check)('nombre', 'El destinatario es necesario').notEmpty(), //nombre
    (0, express_validator_1.check)('correoElectronico', 'El correo de contacto es obligatorio').notEmpty().isEmail(), //correo
    (0, express_validator_1.check)('content', 'El cuerpo html es necesario').notEmpty(),
    validarCampos_1.validarCampos
], sendEmail_controller_1.sendEmailController);
exports.default = router;
