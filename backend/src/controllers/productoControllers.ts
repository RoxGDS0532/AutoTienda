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
    public async update(req:Request, resp:Response){
        const{id}=req.params;
        await pool.query('UPDATE productos SET ? WHERE Id = ?',[req.body,id])
        resp.json({message: 'Updating a producto'});
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