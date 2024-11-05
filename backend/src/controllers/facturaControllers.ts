import { Request, Response } from 'express';
import PDFDocument from 'pdfkit'; // Asegúrate de que pdfkit esté instalado
import { PassThrough } from 'stream';

// Interfaz para definir el tipo de producto
interface Producto {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

// Interfaz para definir la estructura de los datos de la factura
interface FacturaData {
  fecha: Date;
  clienteCorreo: string;
  productos: Producto[];
  subtotal: number;
  descuento: number;
  total: number;
}

// Controlador para generar la factura
export const generarFactura = async (req: Request, res: Response): Promise<void> => {
  try {
    const facturaData: FacturaData = req.body; // Obtiene los datos de la factura del cuerpo de la solicitud

    // Genera el PDF de la factura
    const pdfBuffer = await createInvoice(facturaData); // Función que generará el PDF

    // Establece el tipo de contenido y las cabeceras para la descarga del PDF
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': 'attachment; filename=factura.pdf',
      'Content-Length': pdfBuffer.length
    });

    // Envía el PDF como respuesta
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al generar la factura:', error);
    res.status(500).json({ error: 'Error al generar la factura.' });
  }
};

// Función para crear el PDF
const createInvoice = (facturaData: FacturaData): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const pdfDoc = new PDFDocument();
    const chunks: Buffer[] = [];

    // Configura el flujo del PDF
    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
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
