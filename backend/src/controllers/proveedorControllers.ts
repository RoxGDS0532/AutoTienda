import { Request, Response } from "express";
import pool from "../../database"; // Asegúrate de que esta ruta sea correcta

class ProveedorController {
    public async list(req: Request, res: Response) {
        const proveedor = await pool.query('SELECT * FROM proveedores');
        res.json(proveedor);
    }

    public async create(req: Request, res: Response): Promise<void> {
        console.log(req.body);
        await pool.query('INSERT INTO proveedores SET ?', [req.body]);
        res.json({ message: 'Proveedor guardado' });
    }



    public async delete(req: Request, res: Response): Promise<Response> {
        const { Id } = req.params;

        try {
            const result = await pool.query('DELETE FROM Proveedores WHERE Id = ?', [Id]);

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: 'Proveedor no encontrado' });
            }

            return res.json({ message: 'Proveedor eliminado' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Error al eliminar proveedor', error });
        }
    }
    
    
    

    public async update(req: Request, res: Response): Promise<void> {
        const { Id } = req.params;
        const { Nombre, Contacto, Telefono, Email ,CategoriaId} = req.body;

        // Validación de campos
        if (!Nombre || !Contacto || !Telefono || !Email || !CategoriaId) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return; // Asegúrate de retornar aquí para no continuar
        }

        try {
            const result = await pool.query(
                'UPDATE Proveedores SET Nombre = ?, Contacto = ?, Telefono = ?, Email = ?, CategoriaId = ?, WHERE Id = ?',
                [Nombre, Contacto, Telefono, Email, Id]
            );

            // Verificar si se actualizó algún registro
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Proveedor no encontrado o no actualizado' });
                return; // Asegúrate de retornar aquí para no continuar
            }

            res.json({ message: 'Proveedor actualizado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar proveedor', error });
        }
    }

    

    public async getOne(req: Request, res: Response): Promise<Response> { // Asegúrate de que este método también devuelva una promesa
        const { id } = req.params;
        const proveedor = await pool.query('SELECT * FROM proveedores WHERE Id = ?', [id]);
        if (proveedor.length > 0) {
            return res.json(proveedor[0]);
        }
        return res.status(404).json({ message: 'El proveedor no existe' });
    }
    
}

const proveedorController = new ProveedorController();
export default proveedorController;
