import { Request, Response } from "express";
import pool from "../../database"; // Asegúrate de que la conexión a la base de datos esté correctamente configurada

interface Solicitud {
    productoId: number;
    proveedorId: number | null; // Puedes ajustarlo según sea necesario
    cantidad: number;
}

class SurtirController {
    // Listar todas las solicitudes
    public async list(req: Request, resp: Response): Promise<void> {
        try {
            const solicitudes = await pool.query('SELECT * FROM Solicitudes');
            resp.json(solicitudes);
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al obtener las solicitudes', error });
        }
    }

    // Crear una nueva solicitud
    public async create(req: Request, res: Response): Promise<void> {
        console.log('Cuerpo de la solicitud:', req.body);
        const solicitudes: Solicitud[] = req.body;

        try {
            // Guardar las solicitudes en la base de datos
            await Promise.all(solicitudes.map(async (s: Solicitud) => {
                await pool.query('INSERT INTO Solicitudes SET ?', [s]);

                await pool.query(
                    'UPDATE Productos SET cantidad = cantidad + ? WHERE id = ?',
                    [s.cantidad, s.productoId] 
                );
            }));

            res.json({ message: 'Solicitudes guardadas y cantidades actualizadas' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al guardar solicitudes o actualizar cantidades', error });
        }
    }
    
    
    
    

    // Eliminar una solicitud
    public async delete(req: Request, resp: Response): Promise<void> {
        const { id } = req.params; // Asegúrate de que el parámetro se llame 'id' en la ruta
        try {
            const result = await pool.query('DELETE FROM Solicitudes WHERE id = ?', [id]);
            if (result.affectedRows === 0) {
                resp.status(404).json({ message: 'Solicitud no encontrada' });
            } else {
                resp.json({ message: 'Solicitud eliminada exitosamente' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al eliminar la solicitud', error });
        }
    }

    // Actualizar una solicitud
    public async update(req: Request, resp: Response): Promise<void> {
        const { id } = req.params; // Asegúrate de que el parámetro se llame 'id' en la ruta
        const { productoId, proveedorId, cantidad } = req.body;

        try {
            const result = await pool.query(
                'UPDATE Solicitudes SET productoId = ?, proveedorId = ?, cantidad = ? WHERE id = ?',
                [productoId, proveedorId, cantidad, id]
            );

            // Verificar si se actualizó algún registro
            if (result.affectedRows === 0) {
                resp.status(404).json({ message: 'Solicitud no encontrada o no actualizada' });
                return; // Asegúrate de retornar aquí para no continuar
            }

            resp.json({ message: 'Solicitud actualizada exitosamente' });
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al actualizar la solicitud', error });
        }
    }

    // Obtener una solicitud por ID
    public async getOne(req: Request, resp: Response): Promise<Response> {
        const { id } = req.params;
        try {
            const solicitud = await pool.query('SELECT * FROM Solicitudes WHERE id = ?', [id]);
            if (solicitud.length > 0) {
                return resp.json(solicitud[0]);
            }
            return resp.status(404).json({ message: 'La solicitud no existe' });
        } catch (error) {
            console.error(error);
            return resp.status(500).json({ message: 'Error al obtener la solicitud', error });
        }
    }
    
}

const surtirController = new SurtirController();
export default surtirController;
