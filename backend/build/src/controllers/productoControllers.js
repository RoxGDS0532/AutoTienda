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
            //pool.query('DESCRIBE productos')
            //resp.json('productos');
            const producto = yield database_1.default.query('select * from productos');
            resp.json(producto);
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO productos set ?', [req.body]);
            resp.json({ message: 'producto saved' });
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            yield database_1.default.query('delete from productos where Id=?', [Id]);
            resp.json({ message: 'elimino producto' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            const { Nombre, Categoria, Precio, Cantidad, Stock } = req.body;
            // Validación de campos
            if (!Nombre || !Categoria || Precio === undefined || !Cantidad || Stock === undefined) {
                res.status(400).json({ message: 'Todos los campos son requeridos' });
                return; // Asegúrate de retornar aquí para no continuar
            }
            try {
                const result = yield database_1.default.query('UPDATE productos SET Nombre = ?, Categoria = ?, Precio = ?, Cantidad = ?, Stock = ? WHERE Id = ?', [Nombre, Categoria, Precio, Cantidad, Stock, Id]);
                // Verificar si se actualizó algún registro
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Producto no encontrado o no actualizado' });
                    return; // Asegúrate de retornar aquí para no continuar
                }
                res.json({ message: 'Producto actualizado exitosamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al actualizar producto', error });
            }
        });
    }
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const producto = yield database_1.default.query('select * from productos where Id = ?', [id]);
            if (producto.length > 0) {
                return resp.json(producto[0]);
            }
            resp.status(404).json({ text: 'the a producto doesnt exist' });
        });
    }
}
const productoController = new ProductoController();
exports.default = productoController;
