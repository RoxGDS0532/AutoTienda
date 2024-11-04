import { Request, Response } from 'express';
import { getConnection } from '../../database';

interface DetalleVenta {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

interface Venta {
  fecha_venta: Date;
  hora_venta: Date;
  pago_total: number;
  tipo_pago: string;
  detalles: DetalleVenta[];
}

class VentasController {
  public async create(req: Request, resp: Response): Promise<void> {
    const fechaOriginal = new Date('2024-11-04T04:22:39.417Z');
    const fechaVenta = fechaOriginal.toISOString().slice(0, 19).replace('T', ' ');
    const horaVenta = fechaOriginal.toISOString().slice(11, 19);

    const { pago_total, tipo_pago, detalles } = req.body as Venta;

    const connection = await getConnection();
    try {
        await connection.beginTransaction();

        const ventaResult = await connection.query(
            'INSERT INTO venta (fecha_venta, hora_venta, pago_total, tipo_pago) VALUES (?, ?, ?, ?)',
            [fechaVenta, horaVenta, pago_total, tipo_pago]
        );

        const idVenta = (ventaResult as any).insertId; // Obtén el ID de la venta insertada

        for (const detalle of detalles) {
            await connection.query(
                'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
                [idVenta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario]
            );
        }

        await connection.commit();
        resp.status(201).json({ message: 'Venta registrada exitosamente', ventaId: idVenta });
    } catch (error) {
        await connection.rollback();
        console.error('Error al registrar la venta:', error);
        resp.status(500).json({ message: 'Error al registrar la venta' });
    } finally {
        connection.release();
    }
}

}

const ventasController = new VentasController();
export default ventasController;
