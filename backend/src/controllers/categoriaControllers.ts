import { Request, Response } from "express";
import pool from "../../database";

class CategoriaController{
    public async list (req:Request, resp:Response){
 
        const Categoria=await pool.query('select * from Categorias' );
        resp.json(Categoria)
    }
    public async create(req:Request, resp:Response):Promise<void>{
        console.log(req.body)
        await pool.query('INSERT INTO Categorias set ?',[req.body]);
        resp.json({message : 'Categoria saved'})
    }
    public async delete(req:Request, resp:Response){
        const {Id}=req.params;
        await pool.query('delete from Categorias where Id=?',[Id]);
        resp.json({message : 'elimino Categoria'})
    }

    public async update(req: Request, res: Response): Promise<void> {
        const { Id } = req.params;
        const { Nombre} = req.body;
    
          
        try {
            const result = await pool.query(
                'UPDATE Categorias SET Nombre = ? WHERE Id = ?',
                [Nombre, Id]
            );
    
            // Verificar si se actualizó algún registro
            if (result.affectedRows === 0) {
                res.status(404).json({ message: 'Categoria no encontrado o no actualizado' });
                return; // Asegúrate de retornar aquí para no continuar
            }
    
            res.json({ message: 'Categoria actualizado exitosamente' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error al actualizar Categoria', error });
        }
    }
    

    public async getOne(req:Request, resp:Response){
        const{id}=req.params; 
        const Categoria=await pool.query('select * from Categorias where Id = ?',[id]);
        if(Categoria.length>0){ 
            return resp.json(Categoria[0]);
        }
        resp.status(404).json({text: 'the a Categoria doesnt exist'});
    }
}
const categoriaController = new CategoriaController();
export default categoriaController; 