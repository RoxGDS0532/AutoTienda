import { Request, Response } from "express";
import pool from "../../database"; // Asegúrate de que esta ruta sea correcta

class ConsultasController {
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
    public async getPagoById(req: Request, res: Response): Promise<Response | void> {
        const { id } = req.params as { id: string };
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

    // Método para listar todas las ventas
    public async listVenta(req: Request, res: Response) {
        try {
            const venta = await pool.query('SELECT * FROM Venta');
            res.json(venta);
        } catch (error) {
            console.error('Error en listVentas:', error);
            res.status(500).json({ error: 'Error al obtener venta' });
        }
    }

    // Método para obtener una venta por su ID
    public async getVentaById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const venta = await pool.query('SELECT * FROM venta WHERE Id = ?', [id]);
            if (venta.length > 0) {
                return res.json(venta[0]);
            }
            res.status(404).json({ text: 'Sin datos' });
        } catch (error) {
            console.error('Error en getVentaById:', error);
            res.status(500).json({ error: 'Error al obtener la venta' });
        }
    }

    // Método para listar todos los recibos
    public async listDeVenta(req: Request, res: Response) {
        try {
            const deVenta = await pool.query('SELECT * FROM detalle_venta');
            res.json(deVenta);
        } catch (error) {
            console.error('Error en listRecibos:', error);
            res.status(500).json({ error: 'Error al obtener recibos' });
        }
    }

    // Método para obtener un recibo por su ID
    public async getDeVentaById(req: Request, res: Response) {
        const { id } = req.params;
        try {
            const deVenta = await pool.query('SELECT * FROM detalle_venta WHERE Id = ?', [id]);
            if (deVenta.length > 0) {
                return res.json(deVenta[0]);
            }
            res.status(404).json({ text: 'Sin datos' });
        } catch (error) {
            console.error('Error en getReciboById:', error);
            res.status(500).json({ error: 'Error al obtener el recibo' });
        }
    }

    public async list (req:Request, resp:Response){
        //pool.query('DESCRIBE productos')
        //resp.json('productos');
        const producto=await pool.query('select * from productos' );
        resp.json(producto)
    }

    public async getOne(req:Request, resp:Response){
        const{id}=req.params; 
        const producto=await pool.query('select * from productos where Id = ?',[id]);
        if(producto.length>0){ 
            return resp.json(producto[0]);
        }
        resp.status(404).json({text: 'the a producto doesnt exist'});
    }
}



const consultasController = new ConsultasController();
export default consultasController;
