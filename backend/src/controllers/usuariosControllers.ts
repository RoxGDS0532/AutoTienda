import { Request, Response } from "express";
import pool from "../../database";
import bcrypt from 'bcrypt';

class UsuariosController{
    public async list (req:Request, resp:Response){
        const usuarios=await pool.query('select * from usuarios' );
        resp.json(usuarios)
    }

    public async create(req: Request, resp: Response): Promise<void> {
        try {
            const { Nombre, Correo, Contrasena, Rol } = req.body;
    
            // Verifica que todos los datos estén presentes
            if (!Nombre || !Correo || !Contrasena || !Rol) {
                resp.status(400).json({ message: 'Todos los campos son necesarios' });
                return;
            }
    
            // Inserta el usuario sin encriptar la contraseña
            await pool.query('INSERT INTO Usuarios SET ?', [{ Nombre, Correo, Contrasena, Rol }]);
            
            resp.json({ message: 'Usuario guardado exitosamente' });
        } catch (error) {
            console.error('Error al guardar el usuario:', error);  // Agrega un log para ver el error en el servidor
            resp.status(500).json({ message: 'Error al guardar el usuario', error });
        }
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

    public async login(req: Request, resp: Response): Promise<void> {
        const { Correo, Contrasena } = req.body;
    
        // Agrega logs para ver qué valores se están recibiendo
        console.log(`Correo: ${Correo}`);
        console.log(`Contrasena: ${Contrasena}`);
    
        const result = await pool.query('SELECT * FROM Usuarios WHERE Correo = ?', [Correo]);
    
        if (result.length > 0) {
            const user = result[0];
    
            // Comparar las contraseñas directamente
            console.log(`Contraseña en base de datos: ${user.Contrasena}`); // Verifica qué hay en la base de datos
            console.log(`Contraseña proporcionada: ${Contrasena}`); // Contraseña proporcionada
    
            if (Contrasena === user.Contrasena) {
                resp.json({ message: 'Login successful', user });
            } else {
                resp.status(401).json({ message: 'Invalid email or password' });
            }
        } else {
            resp.status(401).json({ message: 'Invalid email or password 2' });
        }
    }
    
    
    
}
const usuarioController = new UsuariosController();
export default usuarioController; 