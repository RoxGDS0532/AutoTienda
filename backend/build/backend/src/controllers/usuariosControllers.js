"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database"));
class UsuariosController {
    list(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield database_1.default.query('select * from usuarios');
            resp.json(usuarios);
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { Nombre, Correo, Contrasena, Rol } = req.body;
                // Verifica que todos los datos estén presentes
                if (!Nombre || !Correo || !Contrasena || !Rol) {
                    resp.status(400).json({ message: 'Todos los campos son necesarios' });
                    return;
                }
                // Inserta el usuario sin encriptar la contraseña
                yield database_1.default.query('INSERT INTO Usuarios SET ?', [{ Nombre, Correo, Contrasena, Rol }]);
                resp.json({ message: 'Usuario guardado exitosamente' });
            }
            catch (error) {
                console.error('Error al guardar el usuario:', error); // Agrega un log para ver el error en el servidor
                resp.status(500).json({ message: 'Error al guardar el usuario', error });
            }
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            yield database_1.default.query('delete from usuarios where Id=?', [Id]);
            resp.json({ message: 'elimino usuarios' });
        });
    }
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE usuarios SET ? WHERE Id = ?', [req.body, id]);
            resp.json({ message: 'Updating a usuarios' });
        });
    }
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const usuarios = yield database_1.default.query('select * from usuarios where Id = ?', [id]);
            if (usuarios.length > 0) {
                return resp.json(usuarios[0]);
            }
            resp.status(404).json({ text: 'the a usuarios doesnt exist' });
        });
    }
    login(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Correo, Contrasena } = req.body;
            // Agrega logs para ver qué valores se están recibiendo
            console.log(`Correo: ${Correo}`);
            console.log(`Contrasena: ${Contrasena}`);
            const result = yield database_1.default.query('SELECT * FROM Usuarios WHERE Correo = ?', [Correo]);
            if (result.length > 0) {
                const user = result[0];
                // Comparar las contraseñas directamente
                console.log(`Contraseña en base de datos: ${user.Contrasena}`); // Verifica qué hay en la base de datos
                console.log(`Contraseña proporcionada: ${Contrasena}`); // Contraseña proporcionada
                if (Contrasena === user.Contrasena) {
                    resp.json({ message: 'Login successful', user });
                }
                else {
                    resp.status(401).json({ message: 'Invalid email or password' });
                }
            }
            else {
                resp.status(401).json({ message: 'Invalid email or password 2' });
            }
        });
    }
}
const usuarioController = new UsuariosController();
exports.default = usuarioController;
