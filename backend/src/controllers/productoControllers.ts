import { Request, Response } from "express";
import pool from "../../database";

class ProductoController{
    public async list (req:Request, resp:Response){
        //pool.query('DESCRIBE productos')
        //resp.json('productos');
        const producto=await pool.query('select * from productos' );
        resp.json(producto)
    }
    public async create(req:Request, resp:Response):Promise<void>{
        console.log(req.body)
        await pool.query('INSERT INTO productos set ?',[req.body]);
        resp.json({message : 'producto saved'})
    }
    public async delete(req:Request, resp:Response){
        const {Id}=req.params;
        await pool.query('delete from productos where Id=?',[Id]);
        resp.json({message : 'elimino producto'})
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { Id } = req.params;
        const { Nombre, Categoria, Precio, Cantidad, Stock } = req.body;
    
        // Validación de campos
        if (!Nombre || !Categoria || Precio === undefined || !Cantidad || Stock === undefined) {
            res.status(400).json({ message: 'Todos los campos son requeridos' });
            return; // Asegúrate de retornar aquí para no continuar
        }
    
        try {
            const result = await pool.query(
                'UPDATE productos SET Nombre = ?, Categoria = ?, Precio = ?, Cantidad = ?, Stock = ? WHERE Id = ?',
                [Nombre, Categoria, Precio, Cantidad, Stock, Id]
            );
    
            // Verificar si se actualizó algún registro
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Producto no encontrado o no actualizado' });
                return; // Asegúrate de retornar aquí para no continuar
            }
    
            res.json({ message: 'Producto actualizado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar producto', error });
        }
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
const productoController = new ProductoController();
export default productoController; 