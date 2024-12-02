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
const database_1 = __importDefault(require("../../database")); // Asegúrate de que esta ruta sea correcta
class ProveedorController {
    list(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const proveedor = yield database_1.default.query('SELECT * FROM proveedores');
            res.json(proveedor);
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO proveedores SET ?', [req.body]);
            res.json({ message: 'Proveedor guardado' });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            try {
                const [rows] = yield database_1.default.query('SELECT * FROM solicitudes WHERE proveedorId = ?', [Id]);
                if (rows.length > 0) {
                    res.status(400).json({ message: 'No se puede eliminar el proveedor porque está relacionado con solicitudes' });
                    return;
                }
                const result = yield database_1.default.query('DELETE FROM proveedores WHERE Id = ?', [Id]);
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Proveedor no encontrado' });
                    return;
                }
                res.json({ message: 'Proveedor eliminado' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al eliminar el proveedor', error });
            }
        });
    }
    getOne(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const proveedor = yield database_1.default.query('SELECT * FROM proveedores WHERE Id = ?', [id]);
            if (proveedor.length > 0) {
                return res.json(proveedor[0]);
            }
            return res.status(404).json({ message: 'El proveedor no existe' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            const { Nombre, Contacto, Telefono, Email, CategoriaId, NombreProveedor } = req.body;
            // Validación de campos
            if (!Nombre || !Contacto || !Telefono || !Email || !CategoriaId || !NombreProveedor) {
                res.status(400).json({ message: 'Todos los campos son requeridos' });
                return; // Asegúrate de retornar aquí para no continuar
            }
            try {
                const result = yield database_1.default.query('UPDATE Proveedores SET Nombre = ?, Contacto = ?, Telefono = ?, Email = ?, CategoriaId = ?, NombreProveedor = ?, WHERE Id = ?', [Nombre, Contacto, Telefono, Email, Id]);
                // Verificar si se actualizó algún registro
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Proveedor no encontrado o no actualizado' });
                    return; // Asegúrate de retornar aquí para no continuar
                }
                res.json({ message: 'Proveedor actualizado exitosamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al actualizar proveedor', error });
            }
        });
    }
}
const proveedorController = new ProveedorController();
exports.default = proveedorController;
