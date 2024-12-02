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
                    const { Id, Nombre, CategoriaId, Precio, CantidadDisponible, CodigoBarras, ImagenURL } = producto[0];
                    resp.json({
                        Id,
                        Nombre,
                        CategoriaId,
                        Precio,
                        CantidadDisponible,
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
                const productos = yield database_1.default.query('SELECT * FROM Productos');
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
                yield database_1.default.query('INSERT INTO Productos SET ?', [
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
                const result = yield database_1.default.query('DELETE FROM Productos WHERE Id = ?', [Id]);
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
                const result = yield database_1.default.query('UPDATE Productos SET Nombre = ?, Precio = ?, CantidadDisponible = ?, CodigoBarras = ?, CategoriaId = ?, ImagenURL = ? WHERE Id = ?', [Nombre, Precio, CantidadDisponible, CodigoBarras, CategoriaId, ImagenURL, Id]);
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
                const producto = yield database_1.default.query('SELECT * FROM Productos WHERE Id = ?', [Id]);
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
    getProductosEnPromocion(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('Recibiendo solicitud para obtener productos en promoción');
                // Consulta SQL para obtener productos en promoción
                const productos = yield database_1.default.query('SELECT * FROM Productos WHERE EnPromocion = 1 and CantidadDisponible > 5');
                console.log('Productos obtenidos:', productos); // Añadir log de los productos obtenidos
                // Verifica si 'productos' es un arreglo y si tiene elementos
                if (Array.isArray(productos) && productos.length > 0) {
                    resp.json(productos);
                }
                else {
                    console.error('No se encontraron productos en promoción');
                    resp.status(404).json({ message: 'No se encontraron productos en promoción' });
                }
            }
            catch (error) {
                // Verificar si el error es una instancia de Error
                if (error instanceof Error) {
                    console.error('Error al obtener productos en promoción:', error.message);
                    resp.status(500).json({ message: 'Error al obtener productos en promoción', error: error.message });
                }
                else {
                    // Si el error no es un Error conocido, devolvemos un mensaje genérico
                    console.error('Error desconocido:', error);
                    resp.status(500).json({ message: 'Error desconocido', error });
                }
            }
        });
    }
}
const productoController = new ProductoController();
exports.default = productoController;
