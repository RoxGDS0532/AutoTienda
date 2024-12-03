"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.enviarCorreoProveedor = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const enviarCorreoProveedor = (req, resp) => {
    const { producto, proveedorCorreo } = req.body;
    console.log(req.body);
    const config = nodemailer_1.default.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        auth: {
            user: 'rox.renteria1234@gmail.com',
            pass: 'mlgz edcj tdxo axqv',
        },
    });
    // Formatear el mensaje de correo en HTML para el proveedor
    const mensajeHtmlProveedor = `
        <h1>Pedido de productos</h1>
        <h2>Detalles del producto solicitado:</h2>
        <table style="width: 100%; border-collapse: collapse;">
            <tr>
                <th style="border: 1px solid #ddd; padding: 8px;">Nombre</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Cantidad Disponible</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Categoría</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Código de Barras</th>
                <th style="border: 1px solid #ddd; padding: 8px;">Precio</th>
            </tr>
            <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${producto.nombre}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${producto.cantidad}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${producto.categoria}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">${producto.codigoBarras}</td>
                <td style="border: 1px solid #ddd; padding: 8px;">$${producto.precio.toFixed(2)}</td>
            </tr>
        </table>
        <p>Por favor, confirme el pedido o comuníquese si tiene alguna consulta.</p>
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
exports.enviarCorreoProveedor = enviarCorreoProveedor;
