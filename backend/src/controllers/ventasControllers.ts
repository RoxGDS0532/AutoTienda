import { Request, Response } from 'express';
import { getConnection } from '../../database';
import { format, toZonedTime  } from 'date-fns-tz';

import nodemailer from 'nodemailer';


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
  correoCliente: string;
}

class VentasController {public async create(req: Request, resp: Response): Promise<void> {
  const mexicoCityTimeZone = 'America/Mexico_City';
  const fechaActual = new Date();
  const fechaEnMexico = toZonedTime(fechaActual, mexicoCityTimeZone);
  const fechaVenta = format(fechaEnMexico, 'yyyy-MM-dd HH:mm:ss', { timeZone: mexicoCityTimeZone });
  const horaVenta = format(fechaEnMexico, 'HH:mm:ss', { timeZone: mexicoCityTimeZone });

  const { pago_total, tipo_pago, detalles } = req.body as Venta;

  console.log('Datos recibidos:', { pago_total, tipo_pago, detalles });

  const connection = await getConnection();
  try {
      await connection.beginTransaction();

      const ventaResult = await connection.query(
          'INSERT INTO venta (fecha_venta, hora_venta, pago_total, tipo_pago) VALUES (?, ?, ?, ?)',
          [fechaVenta, horaVenta, pago_total, tipo_pago]
      );

      const idVenta = (ventaResult as any).insertId;

      for (const detalle of detalles) {
          console.log('Insertando detalle:', detalle); // <-- Log de cada detalle
          await connection.query(
              'INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
              [idVenta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario]
          );
      }

      await connection.commit();
      resp.status(201).json({ message: 'Venta registrada exitosamente', ventaId: idVenta });
  } catch (error) {
      await connection.rollback();
      console.error('Error al registrar la venta:', error); // <-- Inspecciona el error aquí
      resp.status(500).json({ message: 'Error al registrar la venta' });
  } finally {
      connection.release();
  }
}
}

const ventasController = new VentasController();
export default ventasController;