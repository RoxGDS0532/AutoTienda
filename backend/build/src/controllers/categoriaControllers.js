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
class CategoriaController {
    list(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const Categoria = yield database_1.default.query('select * from Categorias');
            resp.json(Categoria);
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO Categorias set ?', [req.body]);
            resp.json({ message: 'Categoria saved' });
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            yield database_1.default.query('delete from Categorias where Id=?', [Id]);
            resp.json({ message: 'elimino Categoria' });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            const { Nombre } = req.body;
            try {
                const result = yield database_1.default.query('UPDATE Categorias SET Nombre = ? WHERE Id = ?', [Nombre, Id]);
                // Verificar si se actualizó algún registro
                if (result.affectedRows === 0) {
                    res.status(404).json({ message: 'Categoria no encontrado o no actualizado' });
                    return; // Asegúrate de retornar aquí para no continuar
                }
                res.json({ message: 'Categoria actualizado exitosamente' });
            }
            catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Error al actualizar Categoria', error });
            }
        });
    }
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const Categoria = yield database_1.default.query('select * from Categorias where Id = ?', [id]);
            if (Categoria.length > 0) {
                return resp.json(Categoria[0]);
            }
            resp.status(404).json({ text: 'the a Categoria doesnt exist' });
        });
    }
}
const categoriaController = new CategoriaController();
exports.default = categoriaController;
