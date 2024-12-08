"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productosSurtirController_1 = __importDefault(require("../controllers/productosSurtirController"));
const multer_1 = __importDefault(require("multer"));
class ProductoSurtirController {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        const storage = multer_1.default.memoryStorage();
        const upload = (0, multer_1.default)({ storage });
        this.router.get('/', productosSurtirController_1.default.list);
        this.router.get('/:Id', productosSurtirController_1.default.getOne);
        this.router.post('/', upload.single('Imagen'), productosSurtirController_1.default.create);
        this.router.delete('/:Id', productosSurtirController_1.default.delete);
        this.router.put('/:Id', productosSurtirController_1.default.update);
    }
}
const productoSurtirRoutes = new ProductoSurtirController();
exports.default = productoSurtirRoutes.router;
