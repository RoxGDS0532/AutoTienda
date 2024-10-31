import { Request, Response } from "express";
import pool from "../../database"; // Asegúrate de que esta ruta sea correcta

class ConsultasController {
    // Método para listar todas las ventas
    public async listVentas(req: Request, res: Response) {
        const venta = await pool.query('SELECT * FROM Ventas');
        res.json(venta);
    }

    // Método para obtener una venta por su ID
    public async getVentaById(req: Request, res: Response) {
        const { id } = req.params;
        const venta = await pool.query('SELECT * FROM ventas WHERE Id = ?', [id]);
        if (venta.length > 0) {
            return res.json(venta[0]);
        }
        res.status(404).json({ text: 'Sin datos' });
    }

    // Método para listar todos los pagos
    public async listPagos(req: Request, res: Response) {
        const pago = await pool.query('SELECT * FROM Pagos');
        res.json(pago);
    }

    // Método para obtener un pago por su ID
    public async getPagoById(req: Request, res: Response) {
        const { id } = req.params;
        const pago = await pool.query('SELECT * FROM pagos WHERE Id = ?', [id]);
        if (pago.length > 0) {
            return res.json(pago[0]);
        }
        res.status(404).json({ text: 'Sin datos' });
    }

    // Método para listar todos los recibos
    public async listRecibos(req: Request, res: Response) {
        const recibo = await pool.query('SELECT * FROM ResumenRecibos');
        res.json(recibo);
    }

    // Método para obtener un recibo por su ID
    public async getReciboById(req: Request, res: Response) {
        const { id } = req.params;
        const recibo = await pool.query('SELECT * FROM ResumenRecibos WHERE Id = ?', [id]);
        if (recibo.length > 0) {
            return res.json(recibo[0]);
        }
        res.status(404).json({ text: 'Sin datos' });
    }
}

const consultasController = new ConsultasController();
export default consultasController;
