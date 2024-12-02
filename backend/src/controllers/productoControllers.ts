import { Request, Response } from "express";
import pool from "../../database";
import axios from 'axios';

class ProductoController {

    public async getOneByCodigoBarras(req: Request, resp: Response): Promise<void> {
        const { codigoBarras } = req.params;
        try {
            const producto = await pool.query('SELECT * FROM productos WHERE CodigoBarras = ?', [codigoBarras]);
            if (producto.length > 0) {
                const { Id, Nombre, CategoriaId, Precio, CantidadDisponible, CodigoBarras, ImagenURL } = producto[0];
                resp.json({
                    Id,
                    Nombre,
                    CategoriaId,
                    Precio,
                    CantidadDisponible, 
                    CodigoBarras,
                    ImagenURL
                });
            } else {
                resp.status(404).json({ message: 'Producto no encontrado' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al buscar producto por código de barras', error });
        }
    }
   

    public async list(req: Request, resp: Response): Promise<void> {
        try {
            const productos = await pool.query('SELECT * FROM Productos');
            resp.json(productos);
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al obtener productos' });
        }
    }

    public async create(req: Request, resp: Response): Promise<void> {
        const { Nombre, Precio, CantidadDisponible, CodigoBarras, CategoriaId, ImagenURL } = req.body;

        // Validación de campos obligatorios
        if (!Nombre || Precio === undefined || CantidadDisponible === undefined || CategoriaId === undefined || !ImagenURL) {
            resp.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }

        try {
            await pool.query('INSERT INTO Productos SET ?', [
                { Nombre, Precio, CantidadDisponible, ImagenURL, CodigoBarras, CategoriaId }
            ]);
            resp.json({ message: 'Producto guardado' });
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al guardar el producto', error });
        }
    }

    public async delete(req: Request, resp: Response): Promise<void> {
        const { Id } = req.params;
        try {
            const result = await pool.query('DELETE FROM Productos WHERE Id = ?', [Id]);
            if (result.affectedRows === 0) {
                resp.status(404).json({ message: 'Producto no encontrado' });
                return;
            }
            resp.json({ message: 'Producto eliminado' });
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al eliminar el producto', error });
        }
    }

    public async update(req: Request, resp: Response): Promise<void> {
        const { Id } = req.params;
        const { Nombre, Precio, CantidadDisponible, CodigoBarras, CategoriaId, ImagenURL } = req.body;

        // Validación de campos obligatorios
        if (!Nombre || Precio === undefined || CantidadDisponible === undefined || CategoriaId === undefined || !ImagenURL) {
            resp.status(400).json({ message: 'Todos los campos son requeridos' });
            return;
        }

        try {
            const result = await pool.query(
                'UPDATE Productos SET Nombre = ?, Precio = ?, CantidadDisponible = ?, CodigoBarras = ?, CategoriaId = ?, ImagenURL = ? WHERE Id = ?',
                [Nombre, Precio, CantidadDisponible, CodigoBarras, CategoriaId, ImagenURL, Id]
            );

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

    public async getOne(req: Request, resp: Response): Promise<void> {
        const { Id } = req.params;
        try {
            const producto = await pool.query('SELECT * FROM Productos WHERE Id = ?', [Id]);
            if (producto.length > 0) {
                resp.json(producto[0]);
            } else {
                resp.status(404).json({ message: 'El producto no existe' });
            }
        } catch (error) {
            console.error(error);
            resp.status(500).json({ message: 'Error al obtener el producto', error });
        }
    }

      
      public async getProductosEnPromocion(req: Request, resp: Response): Promise<void> {
        try {
            const [productos] = await pool.query('SELECT * FROM Productos WHERE EnPromocion = TRUE');
            
            // Verificar si 'productos' es un arreglo
            if (Array.isArray(productos)) {
                resp.json(productos);  // Solo devolver si es un arreglo
            } else {
                resp.status(500).json({ message: 'Los datos obtenidos no son un arreglo' });
            }
        } catch (error) {
            console.error('Error al obtener productos en promoción:', error);
            resp.status(500).json({ message: 'Error al obtener productos en promoción', error });
        }
    }
    
}

const productoController = new ProductoController();
export default productoController;
