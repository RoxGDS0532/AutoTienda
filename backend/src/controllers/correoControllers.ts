import { Request, Response } from 'express';
import nodemailer from 'nodemailer';

const envioCorreo = (req: Request, resp: Response): void => {
    const { correo, detalles } = req.body;

    const config = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'rox.renteria1234@gmail.com',
            pass: 'mlgz edcj tdxo axqv', // Contraseña o token de acceso
        },
    });

    // Formatear el mensaje de correo en HTML
    let mensajeHtml = `
        <h1>¡Gracias por tu compra!</h1>
        <h2>Detalles de tu venta:</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Nombre del Producto</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Precio Unitario</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Total</th>
            </tr>
    `;
    let mensajeHtmlProveedor = `
        <h1>Pedido de productos</h1>
        <h2>Detalles del pedido:</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Nombre del Producto</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Cantidad</th>
            </tr>
    `;

    detalles.forEach((detalle: { nombre: string; cantidad: number; precio_unitario: number; total_pago: number }) => {
        mensajeHtml += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${detalle.nombre}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${detalle.cantidad}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${detalle.precio_unitario.toFixed(2)}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${detalle.total_pago.toFixed(2)}</td>
            </tr>
        `;
        mensajeHtmlProveedor += `
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${detalle.nombre}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${detalle.cantidad}</td>
            </tr>
        `;
    });

    mensajeHtml += `
        </table>
        <p>¡Esperamos verte pronto!</p>
    `;

    const opciones = {
        from: 'Superama <rox.renteria1234@gmail.com>',
        to: correo,
        subject: 'Detalle de Venta',
        html: mensajeHtml, 
    };

    config.sendMail(opciones, (error, result) => {
        if (error) return resp.json({ ok: false, msg: error });

        return resp.json({
            ok: true,
            msg: 'Correo enviado exitosamente',
            result,
        });
    });
};

export { envioCorreo };







