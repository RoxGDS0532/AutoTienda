"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productosRecomController_1 = __importDefault(require("../controllers/productosRecomController"));
const multer_1 = __importDefault(require("multer"));
class ProductoRecomendadoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        const storage = multer_1.default.memoryStorage();
        const upload = (0, multer_1.default)({ storage });
        this.router.get('/', productosRecomController_1.default.list);
        this.router.get('/:Id', productosRecomController_1.default.getOne);
        this.router.post('/', upload.single('Imagen'), productosRecomController_1.default.create);
        this.router.delete('/:Id', productosRecomController_1.default.delete);
        this.router.put('/:Id', productosRecomController_1.default.update);
    }
}
const productoRecomendadoRoutes = new ProductoRecomendadoRoutes();
exports.default = productoRecomendadoRoutes.router;
