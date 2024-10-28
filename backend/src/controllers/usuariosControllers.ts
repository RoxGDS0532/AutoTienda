import { Request, Response } from "express";
import pool from "../../database";

class UsuariosController{
    public async list (req:Request, resp:Response){
        const usuarios=await pool.query('select * from usuarios' );
        resp.json(usuarios)
    }
    public async create(req:Request, resp:Response):Promise<void>{
        console.log(req.body)
        await pool.query('INSERT INTO usuarios set ?',[req.body]);
        resp.json({message : 'usuarios saved'})
    }
    public async delete(req:Request, resp:Response){
        const {Id}=req.params;
        await pool.query('delete from usuarios where Id=?',[Id]);
        resp.json({message : 'elimino usuarios'})
    }
    public async update(req:Request, resp:Response){
        const{id}=req.params;
        await pool.query('UPDATE usuarios SET ? WHERE Id = ?',[req.body,id])
        resp.json({message: 'Updating a usuarios'});
    }
    public async getOne(req:Request, resp:Response){
        const{id}=req.params; 
        const usuarios=await pool.query('select * from usuarios where Id = ?',[id]);
        if(usuarios.length>0){ 
            return resp.json(usuarios[0]);
        }
        resp.status(404).json({text: 'the a usuarios doesnt exist'});
    }
}
const usuarioController = new UsuariosController();
export default usuarioController; 