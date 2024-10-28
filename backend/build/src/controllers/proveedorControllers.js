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
class ProveedorController {
    list(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            //pool.query('DESCRIBE productos')
            //resp.json('productos');
            const proveedor = yield database_1.default.query('select * from proveedores');
            resp.json(proveedor);
        });
    }
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(req.body);
            yield database_1.default.query('INSERT INTO proveedores set ?', [req.body]);
            resp.json({ message: 'proveedor saved' });
        });
    }
    delete(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { Id } = req.params;
            yield database_1.default.query('delete from proveedores where Id=?', [Id]);
            resp.json({ message: 'elimino proveedores' });
        });
    }
    update(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            yield database_1.default.query('UPDATE proveedores SET ? WHERE Id = ?', [req.body, id]);
            resp.json({ message: 'Updating a proveedores' });
        });
    }
    getOne(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            const proveedor = yield database_1.default.query('select * from proveedores where Id = ?', [id]);
            if (proveedor.length > 0) {
                return resp.json(proveedor[0]);
            }
            resp.status(404).json({ text: 'the a proveedores doesnt exist' });
        });
    }
}
const proveedorController = new ProveedorController();
exports.default = proveedorController;
