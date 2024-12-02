"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoControllers_1 = __importDefault(require("../controllers/productoControllers"));
const multer_1 = __importDefault(require("multer"));
const correoProveedorControllers_1 = require("../controllers/correoProveedorControllers");
class ProductoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        const storage = multer_1.default.memoryStorage();
        const upload = (0, multer_1.default)({ storage });
        this.router.get('/promocion', productoControllers_1.default.getProductosEnPromocion);
        this.router.get('/codigo/:codigoBarras', productoControllers_1.default.getOneByCodigoBarras);
        this.router.get('/', productoControllers_1.default.list);
        this.router.get('/:Id', productoControllers_1.default.getOne);
        this.router.post('/', upload.single('Imagen'), productoControllers_1.default.create);
        this.router.delete('/:Id', productoControllers_1.default.delete);
        this.router.put('/:Id', productoControllers_1.default.update);
        this.router.post('/enviar', correoProveedorControllers_1.enviarCorreoProveedor);
        this.router.get('/promocion', productoControllers_1.default.getProductosEnPromocion);
    }
}
const productoRoutes = new ProductoRoutes();
exports.default = productoRoutes.router;
