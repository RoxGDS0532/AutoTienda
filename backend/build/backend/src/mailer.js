"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const router = express_1.default.Router();
// Configuración de nodemailer
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // Cambia esto si usas otro servicio
    auth: {
        user: 'rox.renteria1234@gmail.com', // Tu correo electrónico
        pass: 'mlgz edcj tdxo axqv', // Tu contraseña o un token de acceso
    },
});
// Endpoint para enviar correos
router.post('/send-email', (req, res) => {
    const { correo, detalles } = req.body;
    const mailOptions = {
        from: 'rox.renteria1234@gmail.com', // Tu correo electrónico
        to: correo,
        subject: 'Detalles de tu compra',
        text: `Aquí están los detalles de tu compra:\n${JSON.stringify(detalles, null, 2)}`,
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return res.status(500).send(error.toString());
        }
        res.status(200).send('Correo enviado: ' + info.response);
    });
});
exports.default = router;
