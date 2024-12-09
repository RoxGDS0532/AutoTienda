import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const enviarCorreoProveedor = (req: Request, resp: Response): void => {
    const { producto, proveedorCorreo } = req.body;
    console.log(req.body);

    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'rox.renteria1234@gmail.com', 
            pass: 'mlgz edcj tdxo axqv', 
        },
    });

    // Formatear el mensaje de correo en HTML
    const mensajeHtmlProveedor = `
        <div style="font-family: Arial, sans-serif; line-height: 1.5;">
            <h1 style="color: #007bff; text-align: center;">Pedido de Productos</h1>
            <p>Estimado proveedor,</p>
            <p>Se ha generado una solicitud de pedido con los siguientes detalles:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Nombre</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Cantidad Solicitada</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Categoría</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Código de Barras</th>
                        <th style="border: 1px solid #ddd; padding: 10px; text-align: left;">Precio</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #ddd; padding: 10px;">${producto.nombre}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${producto.cantidad}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${producto.categoria}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">${producto.codigoBarras}</td>
                        <td style="border: 1px solid #ddd; padding: 10px;">$${producto.precio.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            <p style="color: #555;">Por favor, confirme el pedido a la brevedad posible. Si tiene alguna duda, no dude en comunicarse con nosotros.</p>
            <footer style="text-align: center; margin-top: 30px; color: #888;">
                <p>Atentamente,</p>
                <p><strong>Superama</strong></p>
                <p>Teléfono: 123-456-7890 | Correo: soporte@superama.com</p>
            </footer>
        </div>
    `;

    const opciones = {
        from: 'Superama <rox.renteria1234@gmail.com>',
        to: proveedorCorreo, 
        subject: 'Solicitud de Pedido de Productos',
        html: mensajeHtmlProveedor,
    };

    config.sendMail(opciones, (error, result) => {
        if (error) {
            console.error('Error al enviar correo:', error);
            return resp.status(500).json({ ok: false, msg: 'Error al enviar el correo.', error });
        }

        console.log('Correo enviado exitosamente:', result);
        return resp.status(200).json({
            ok: true,
            msg: 'Correo enviado exitosamente al proveedor.',
            result,
        });
    });
};

export { enviarCorreoProveedor };
