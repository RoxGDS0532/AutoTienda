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
const database_1 = __importDefault(require("../../database")); // Asegúrate de que la conexión a la base de datos esté correctamente configurada
class SurtirController {
    // Listar todas las solicitudes
    list(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const solicitudes = yield database_1.default.query('SELECT * FROM Solicitudes');
                resp.json(solicitudes);
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al obtener las solicitudes', error });
            }
        });
    }
    // Crear una nueva solicitud
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Cuerpo de la solicitud:', req.body);
            const solicitudes = req.body;
            try {
                // Guardar las solicitudes en la base de datos
                yield Promise.all(solicitudes.map((s) => __awaiter(this, void 0, void 0, function* () {
                    yield database_1.default.query('INSERT INTO Solicitudes SET ?', [s]);
                    yield database_1.default.query('UPDATE Productos SET cantidad = cantidad + ? WHERE id = ?', [s.cantidad, s.productoId]);
                })));
                res.json({ message: 'Solicitudes guardadas y cantidades actualizadas' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al guardar solicitudes o actualizar cantidades', error });
            }
        });
    }
    // Eliminar una solicitud
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // Asegúrate de que el parámetro se llame 'id' en la ruta
            try {
                const result = yield database_1.default.query('DELETE FROM Solicitudes WHERE id = ?', [id]);
                if (result.affectedRows === 0) {
                    resp.status(404).json({ message: 'Solicitud no encontrada' });
                }
                else {
                    resp.json({ message: 'Solicitud eliminada exitosamente' });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al eliminar la solicitud', error });
            }
        });
    }
    // Actualizar una solicitud
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params; // Asegúrate de que el parámetro se llame 'id' en la ruta
            const { productoId, proveedorId, cantidad } = req.body;
            try {
                const result = yield database_1.default.query('UPDATE Solicitudes SET productoId = ?, proveedorId = ?, cantidad = ? WHERE id = ?', [productoId, proveedorId, cantidad, id]);
                // Verificar si se actualizó algún registro
                if (result.affectedRows === 0) {
                    resp.status(404).json({ message: 'Solicitud no encontrada o no actualizada' });
                    return; // Asegúrate de retornar aquí para no continuar
                }
                resp.json({ message: 'Solicitud actualizada exitosamente' });
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al actualizar la solicitud', error });
            }
        });
    }
    // Obtener una solicitud por ID
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const solicitud = yield database_1.default.query('SELECT * FROM Solicitudes WHERE id = ?', [id]);
                if (solicitud.length > 0) {
                    return resp.json(solicitud[0]);
                }
                return resp.status(404).json({ message: 'La solicitud no existe' });
            }
            catch (error) {
                console.error(error);
                return resp.status(500).json({ message: 'Error al obtener la solicitud', error });
            }
        });
    }
}
const surtirController = new SurtirController();
exports.default = surtirController;
