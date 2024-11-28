"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventasControllers_1 = __importDefault(require("../controllers/ventasControllers"));
const correoControllers_1 = require("../controllers/correoControllers");
class VentasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/', ventasControllers_1.default.create);
        this.router.post('/envio', correoControllers_1.envioCorreo);
        this.router.get('/', (req, res) => {
            res.status(200).json({ message: 'Ruta /ventas disponible, pero usa POST para registrar ventas.' });
        });
    }
}
const ventasRoutes = new VentasRoutes();
exports.default = ventasRoutes.router;
