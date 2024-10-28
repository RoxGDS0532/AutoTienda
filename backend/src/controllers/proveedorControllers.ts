import { Request, Response } from "express";
import pool from "../../database";

class ProveedorController{
    public async list (req:Request, resp:Response){
        //pool.query('DESCRIBE productos')
        //resp.json('productos');
        const proveedor=await pool.query('select * from proveedores' );
        resp.json(proveedor)
    }
    public async create(req:Request, resp:Response):Promise<void>{
        console.log(req.body)
        await pool.query('INSERT INTO proveedores set ?',[req.body]);
        resp.json({message : 'proveedor saved'})
    }
    public async delete(req:Request, resp:Response){
        const {Id}=req.params;
        await pool.query('delete from proveedores where Id=?',[Id]);
        resp.json({message : 'elimino proveedores'})
    }
    public async update(req:Request, resp:Response){
        const{id}=req.params;
        await pool.query('UPDATE proveedores SET ? WHERE Id = ?',[req.body,id])
        resp.json({message: 'Updating a proveedores'});
    }
    public async getOne(req:Request, resp:Response){
        const{id}=req.params; 
        const proveedor=await pool.query('select * from proveedores where Id = ?',[id]);
        if(proveedor.length>0){ 
            return resp.json(proveedor[0]);
        }
        resp.status(404).json({text: 'the a proveedores doesnt exist'});
    }
}
const proveedorController = new ProveedorController();
export default proveedorController; 