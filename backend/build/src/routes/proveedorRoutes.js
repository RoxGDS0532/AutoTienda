"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedorControllers_1 = __importDefault(require("../controllers/proveedorControllers")); // Verifica que esta ruta sea correcta
class ProveedorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', proveedorControllers_1.default.list.bind(proveedorControllers_1.default)); // Usar bind
        this.router.post('/', proveedorControllers_1.default.create.bind(proveedorControllers_1.default)); // Usar bind
        this.router.delete('/:Id', proveedorControllers_1.default.delete.bind(proveedorControllers_1.default));
        this.router.put('/:Id', proveedorControllers_1.default.update.bind(proveedorControllers_1.default)); // Usar bind
    }
}
const proveedorRoutes = new ProveedorRoutes();
exports.default = proveedorRoutes.router;
