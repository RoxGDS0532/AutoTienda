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
exports.generarFactura = void 0;
const pdfkit_1 = __importDefault(require("pdfkit")); // Asegúrate de que pdfkit esté instalado
// Controlador para generar la factura
const generarFactura = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const facturaData = req.body; // Obtiene los datos de la factura del cuerpo de la solicitud
        // Genera el PDF de la factura
        const pdfBuffer = yield createInvoice(facturaData); // Función que generará el PDF
        // Establece el tipo de contenido y las cabeceras para la descarga del PDF
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename=factura.pdf',
            'Content-Length': pdfBuffer.length
        });
        // Envía el PDF como respuesta
        res.send(pdfBuffer);
    }
    catch (error) {
        console.error('Error al generar la factura:', error);
        res.status(500).json({ error: 'Error al generar la factura.' });
    }
});
exports.generarFactura = generarFactura;
// Función para crear el PDF
const createInvoice = (facturaData) => {
    return new Promise((resolve, reject) => {
        const pdfDoc = new pdfkit_1.default();
        const chunks = [];
        // Configura el flujo del PDF
        pdfDoc.on('data', (chunk) => chunks.push(chunk));
        pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
        pdfDoc.on('error', reject);
        // Aquí construirías el PDF con la información de la factura
        pdfDoc.fontSize(25).text('Factura', { align: 'center' });
        pdfDoc.text(`Fecha: ${facturaData.fecha}`);
        pdfDoc.text(`Cliente: ${facturaData.clienteCorreo}`);
        pdfDoc.moveDown();
        pdfDoc.text('Productos:');
        facturaData.productos.forEach((producto) => {
            pdfDoc.text(`${producto.nombre} - Cantidad: ${producto.cantidad} - Precio Unitario: ${producto.precioUnitario} - Total: ${producto.total}`);
        });
        pdfDoc.moveDown();
        pdfDoc.text(`Subtotal: ${facturaData.subtotal}`);
        pdfDoc.text(`Descuento: ${facturaData.descuento}`);
        pdfDoc.text(`Total: ${facturaData.total}`);
        pdfDoc.end();
    });
};
