"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const consultasControllers_1 = __importDefault(require("../controllers/consultasControllers"));
class ConsultasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/venta', consultasControllers_1.default.listVentas.bind(consultasControllers_1.default));
        this.router.get('/pago', consultasControllers_1.default.listPagos.bind(consultasControllers_1.default));
        this.router.get('/recibo', consultasControllers_1.default.listRecibos.bind(consultasControllers_1.default));
    }
}
const proveedorRoutes = new ConsultasRoutes();
exports.default = proveedorRoutes.router;
