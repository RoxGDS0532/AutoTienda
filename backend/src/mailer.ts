import express, { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configuración de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: 'rox.renteria1234@gmail.com', // Tu correo electrónico
    pass: 'mlgz edcj tdxo axqv', // Tu contraseña o un token de acceso
  },
});

// Endpoint para enviar correos
router.post('/send-email', (req: Request, res: Response) => {
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

export default router;
