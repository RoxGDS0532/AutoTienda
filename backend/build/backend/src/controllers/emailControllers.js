"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// backend/routes/email.ts
const express_1 = require("express");
const nodemailer_1 = __importDefault(require("nodemailer"));
const proveedor_service_1 = require("../../../frontend/src/app/services/proveedor.service"); // Asegúrate de importar correctamente el servicio de proveedores.
const producto_service_1 = require("../../../frontend/src/app/services/producto.service");
const router = (0, express_1.Router)();
// Configuración de Nodemailer
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: 'rox.renteria1234@gmail.com',
        pass: 'mlgz edcj tdxo axqv', // Usar App Password en lugar de la contraseña normal de Gmail
    },
});
class EmailController {
    sendOrderEmail(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Verificar que los datos se recibieron correctamente
                console.log("Datos recibidos:", req.body); // Log para verificar datos recibidos
                const { proveedorId, cantidad, productoId } = req.body;
                // Obtener datos del proveedor
                const proveedor = yield proveedor_service_1.ProveedorService.obtenerProveedorPorId(proveedorId);
                if (!proveedor) {
                    return res.status(404).json({ error: 'Proveedor no encontrado' });
                }
                // Obtener datos del producto
                const producto = yield producto_service_1.ProductoService.obtenerProductoPorId(productoId);
                if (!producto) {
                    return res.status(404).json({ error: 'Producto no encontrado' });
                }
                // Configuración del correo
                const mailOptions = {
                    from: 'rox.renteria1234@gmail.com',
                    to: proveedor.Email,
                    subject: 'Sugerencia de producto aceptada',
                    text: `
          Estimado/a ${proveedor.Nombre},
          Se ha aceptado una sugerencia para el producto "${producto.Nombre}".
          Cantidad solicitada: ${cantidad}
          Producto: ${producto.Nombre}
          Precio: ${producto.Precio}
          Saludos cordiales.`,
                };
                // Enviar el correo
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        console.error("Error al enviar el correo:", error);
                        return res.status(500).json({ error: error.toString() });
                    }
                    console.log("Correo enviado:", info.response);
                    return res.status(200).json({ message: 'Correo enviado', response: info.response });
                });
            }
            catch (error) {
                console.error("Error en el servidor:", error);
                if (error instanceof Error) {
                    return res.status(500).json({ error: error.message });
                }
                else {
                    return res.status(500).json({ error: 'Error desconocido' });
                }
            }
        });
    }
    ;
}
exports.default = router;
