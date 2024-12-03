import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const sendOrderEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { correo, detallesPedido } = req.body;

    if (!correo || !detallesPedido || !Array.isArray(detallesPedido) || detallesPedido.length === 0) {
      res.status(400).json({ ok: false, msg: 'Datos incompletos o incorrectos: se requiere correo y detalles del pedido.' });
      return;
    }

    // Validar que cada elemento en detallesPedido tenga nombreProducto y cantidad
    for (let i = 0; i < detallesPedido.length; i++) {
      const { nombreProducto, cantidad } = detallesPedido[i];
      if (!nombreProducto || !cantidad) {
        res.status(400).json({ ok: false, msg: `Datos del producto incompletos en el ítem ${i + 1}.` });
        return;
      }
    }

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,  // Cambié el puerto a 465
      secure: true,  // Habilité el SSL
      auth: {
        user: 'rox.renteria1234@gmail.com',
        pass: 'mlgz edcj tdxo axqv',  // Asegúrate de usar la contraseña de aplicación si tienes 2FA habilitada
      },
      tls: {
        rejectUnauthorized: false, // Esto puede ser útil si tienes problemas con la verificación del certificado SSL
      },
      logger: true,  // Activar log de la conexión
      debug: true,  // Muestra detalles de la conexión
    });
    

    const mensajeHtml = `
      <h1>Pedido de productos de superama</h1>
      <h2>Detalles del pedido:</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <th style="border: 1px solid #ddd; padding: 8px;">Nombre del Producto</th>
          <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
        </tr>
        ${detallesPedido
          .map(
            (detalle: { nombreProducto: string; cantidad: number }) => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${detalle.nombreProducto}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${detalle.cantidad}</td>
              </tr>
            `
          )
          .join('')}
      </table>
      <p>Por favor, confirme la recepción de este pedido a la brevedad.</p>
    `;

    const mailOptions = {
      from: 'Superama <rox.renteria1234@gmail.com>',
      to: correo,
      subject: 'Pedido de Productos',
      html: mensajeHtml,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error al enviar correo:', error);
        res.status(500).json({ ok: false, msg: 'Error al enviar el correo.', error });
        return;
      }

      res.status(200).json({ ok: true, msg: 'Correo enviado exitosamente.', info });
    });
  } catch (error) {
    console.error('Error interno:', error);
    res.status(500).json({ ok: false, msg: 'Error interno del servidor.', error });
  }
};

export default { sendOrderEmail };
