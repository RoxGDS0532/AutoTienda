import { Request, Response } from "express";
import pool from "../../database";

class ProductoController{
    public async list (req:Request, resp:Response){
        //pool.query('DESCRIBE productos')
        //resp.json('productos');
        const producto=await pool.query('select * from productos' );
        resp.json(producto)
    }

    public async create(req: Request, resp: Response): Promise<void> {
        console.log(req.body);
        console.log(req.file); // Muestra la información del archivo

        const { Nombre, Precio, Cantidad, Stock, CodigoQR, CategoriaId } = req.body;
        const Imagen = req.file ? req.file.buffer : null; // Puedes almacenar el archivo o su nombre/ruta


        // Validación de campos
        if (!Nombre || Precio === undefined || Cantidad === undefined || Stock === undefined || CategoriaId === undefined || !Imagen) {
            resp.status(400).json({ message: 'Todos los campos son requeridoss' });
            return;
        }

        await pool.query('INSERT INTO Productos SET ?', [{ Nombre, Precio, Cantidad, Stock, Imagen, CodigoQR, CategoriaId }]);
        resp.json({ message: 'Producto guardado' });
    }

    public async delete(req: Request, resp: Response) {
        const { Id } = req.params;
        await pool.query('DELETE FROM Productos WHERE Id = ?', [Id]);
        resp.json({ message: 'Producto eliminado' });
    }

    public async update(req: Request, resp: Response): Promise<void> {
        const { Id } = req.params;
        const { Nombre, Precio, Cantidad, Stock, CategoriaId } = req.body;
    
        console.log('ID:', Id);
        console.log('Cuerpo de la solicitud:', req.body);
    
        // Validación de campos
        if (!Nombre || Precio === undefined || Cantidad === undefined || Stock === undefined || CategoriaId === undefined) {
            resp.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }
    
        try {
            const result = await pool.query(
                'UPDATE Productos SET Nombre = ?, Precio = ?, Cantidad = ?, Stock = ?, CategoriaId = ? WHERE Id = ?',
                [Nombre, Precio, Cantidad, Stock, CategoriaId, Id]
            );
    
            // Verificar si se actualizó algún registro
            if (result.affectedRows === 0) {
                resp.status(404).json({ message: 'Producto no encontrado o no actualizado' });
                return;
            }
    
            resp.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al actualizar producto', error });
        }
    }
    

    public async getOne(req: Request, resp: Response) {
        const { id } = req.params;
        const producto = await pool.query('SELECT * FROM Productos WHERE Id = ?', [id]);
        if (producto.length > 0) {
            return resp.json(producto[0]);
        }
        resp.status(404).json({ message: 'El producto no existe' });
    }
}

const productoController = new ProductoController();
export default productoController;
