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
class ProductoController {
    getOneByCodigoBarras(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { codigoBarras } = req.params;
            try {
                const producto = yield database_1.default.query('SELECT * FROM productos WHERE CodigoBarras = ?', [codigoBarras]);
                if (producto.length > 0) {
                    resp.json(producto[0]);
                }
                else {
                    resp.status(404).json({ message: 'Producto no encontrado' });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al buscar producto por código de barras', error });
            }
        });
    }
    list(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const productos = yield database_1.default.query('SELECT * FROM Productos');
            resp.json(productos);
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            console.log(req.file); // Muestra la información del archivo
            const { Nombre, Precio, Cantidad, Stock, CodigoQR, CategoriaId } = req.body;
            const Imagen = req.file ? req.file.buffer : null; // Puedes almacenar el archivo o su nombre/ruta
            // Validación de campos
            if (!Nombre || Precio === undefined || Cantidad === undefined || Stock === undefined || CategoriaId === undefined || !Imagen) {
                resp.status(400).json({ message: 'Todos los campos son requeridoss' });
                return;
            }
            yield database_1.default.query('INSERT INTO Productos SET ?', [{ Nombre, Precio, Cantidad, Stock, Imagen, CodigoQR, CategoriaId }]);
            resp.json({ message: 'Producto guardado' });
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            yield database_1.default.query('DELETE FROM Productos WHERE Id = ?', [Id]);
            resp.json({ message: 'Producto eliminado' });
        });
    }
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            const { Nombre, Precio, Cantidad, Stock, CategoriaId } = req.body;
            console.log('ID:', Id);
            console.log('Cuerpo de la solicitud:', req.body);
            // Validación de campos
            if (!Nombre || Precio === undefined || Cantidad === undefined || Stock === undefined || CategoriaId === undefined) {
                resp.status(400).json({ message: 'Todos los campos son requeridos' });
                return;
            }
            try {
                const result = yield database_1.default.query('UPDATE Productos SET Nombre = ?, Precio = ?, Cantidad = ?, Stock = ?, CategoriaId = ? WHERE Id = ?', [Nombre, Precio, Cantidad, Stock, CategoriaId, Id]);
                // Verificar si se actualizó algún registro
                if (result.affectedRows === 0) {
                    resp.status(404).json({ message: 'Producto no encontrado o no actualizado' });
                    return;
                }
                resp.json({ message: 'Producto actualizado exitosamente' });
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al actualizar producto', error });
            }
        });
    }
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield database_1.default.query('SELECT * FROM Productos WHERE Id = ?', [id]);
            if (producto.length > 0) {
                return resp.json(producto[0]);
            }
            resp.status(404).json({ message: 'El producto no existe' });
        });
    }
}
const productoController = new ProductoController();
exports.default = productoController;
