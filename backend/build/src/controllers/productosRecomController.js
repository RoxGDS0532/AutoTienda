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
class ProductoRecomendadoController {
    getOneByCategoria(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { categoria } = req.params;
            try {
                const producto = yield database_1.default.query('SELECT * FROM productos_recomendados WHERE categoria_id = ?', [categoria]);
                if (producto.length > 0) {
                    const { Id, Nombre, CategoriaId, Precio, CodigoBarras, ImagenURL } = producto[0];
                    resp.json({
                        Id,
                        Nombre,
                        CategoriaId,
                        Precio,
                        CodigoBarras,
                        ImagenURL
                    });
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
            try {
                const productos = yield database_1.default.query('SELECT * FROM productos_recomendados');
                resp.json(productos);
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al obtener productos' });
            }
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Nombre, Precio, CantidadDisponible, CodigoBarras, CategoriaId, ImagenURL } = req.body;
            // Validación de campos obligatorios
            if (!Nombre || Precio === undefined || CantidadDisponible === undefined || CategoriaId === undefined || !ImagenURL) {
                resp.status(400).json({ message: 'Todos los campos son requeridos' });
                return;
            }
            try {
                yield database_1.default.query('INSERT INTO productos_recomendados SET ?', [
                    { Nombre, Precio, CantidadDisponible, ImagenURL, CodigoBarras, CategoriaId }
                ]);
                resp.json({ message: 'Producto guardado' });
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al guardar el producto', error });
            }
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            try {
                const result = yield database_1.default.query('DELETE FROM productos_recomendados WHERE Id = ?', [Id]);
                if (result.affectedRows === 0) {
                    resp.status(404).json({ message: 'Producto no encontrado' });
                    return;
                }
                resp.json({ message: 'Producto eliminado' });
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al eliminar el producto', error });
            }
        });
    }
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            const { Nombre, Precio, CantidadDisponible, CodigoBarras, CategoriaId, ImagenURL } = req.body;
            // Validación de campos obligatorios
            if (!Nombre || Precio === undefined || CantidadDisponible === undefined || CategoriaId === undefined || !ImagenURL) {
                resp.status(400).json({ message: 'Todos los campos son requeridos' });
                return;
            }
            try {
                const result = yield database_1.default.query('UPDATE productos_recomendados SET Nombre = ?, Precio = ?, CantidadDisponible = ?, CodigoBarras = ?, CategoriaId = ?, ImagenURL = ? WHERE Id = ?', [Nombre, Precio, CantidadDisponible, CodigoBarras, CategoriaId, ImagenURL, Id]);
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
            const { Id } = req.params;
            try {
                const producto = yield database_1.default.query('SELECT * FROM productos_recomendados WHERE Id = ?', [Id]);
                if (producto.length > 0) {
                    resp.json(producto[0]);
                }
                else {
                    resp.status(404).json({ message: 'El producto no existe' });
                }
            }
            catch (error) {
                console.error(error);
                resp.status(500).json({ message: 'Error al obtener el producto', error });
            }
        });
    }
}
const productoRecomendadoController = new ProductoRecomendadoController();
exports.default = productoRecomendadoController;
