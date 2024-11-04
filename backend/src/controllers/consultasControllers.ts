import { Request, Response } from "express";
import pool from "../../database"; // Asegúrate de que esta ruta sea correcta

class ConsultasController {
    // Método para listar todas las ventas
    public async listVentas(req: Request, res: Response) {
        try {
            const venta = await pool.query('SELECT * FROM Ventas');
            res.json(venta);
        } catch (error) {
            console.error('Error en listVentas:', error);
            res.status(500).json({ error: 'Error al obtener ventas' });
        }
    }

    // Método para obtener una venta por su ID
    public async getVentaById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const venta = await pool.query('SELECT * FROM ventas WHERE Id = ?', [id]);
            if (venta.length > 0) {
                return res.json(venta[0]);
            }
            res.status(404).json({ text: 'Sin datos' });
        } catch (error) {
            console.error('Error en getVentaById:', error);
            res.status(500).json({ error: 'Error al obtener la venta' });
        }
    }

    // Método para listar todos los pagos
    public async listPagos(req: Request, res: Response) {
        try {
            const pago = await pool.query('SELECT * FROM Pagos');
            res.json(pago);
        } catch (error) {
            console.error('Error en listPagos:', error);
            res.status(500).json({ error: 'Error al obtener pagos' });
        }
    }

    // Método para obtener un pago por su ID
    public async getPagoById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const pago = await pool.query('SELECT * FROM pagos WHERE Id = ?', [id]);
            if (pago.length > 0) {
                return res.json(pago[0]);
            }
            res.status(404).json({ text: 'Sin datos' });
        } catch (error) {
            console.error('Error en getPagoById:', error);
            res.status(500).json({ error: 'Error al obtener el pago' });
        }
    }

    // Método para listar todos los recibos
    public async listRecibos(req: Request, res: Response) {
        try {
            const recibo = await pool.query('SELECT * FROM ResumenRecibos');
            res.json(recibo);
        } catch (error) {
            console.error('Error en listRecibos:', error);
            res.status(500).json({ error: 'Error al obtener recibos' });
        }
    }

    // Método para obtener un recibo por su ID
    public async getReciboById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const recibo = await pool.query('SELECT * FROM ResumenRecibos WHERE Id = ?', [id]);
            if (recibo.length > 0) {
                return res.json(recibo[0]);
            }
            res.status(404).json({ text: 'Sin datos' });
        } catch (error) {
            console.error('Error en getReciboById:', error);
            res.status(500).json({ error: 'Error al obtener el recibo' });
        }
    }
}

const consultasController = new ConsultasController();
export default consultasController;
