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
        this.router.get('/venta', consultasControllers_1.default.listVenta);
        this.router.get('/pago', consultasControllers_1.default.listPagos);
        this.router.get('/deVenta', consultasControllers_1.default.listDeVenta);
        this.router.get('/producto', consultasControllers_1.default.list);
        this.router.get('/getPagoById/:id', consultasControllers_1.default.getPagoById.bind);
        this.router.get('/getVentaById/:id', consultasControllers_1.default.getVentaById.bind);
        this.router.get('/getDeVentaById/:id', consultasControllers_1.default.getDeVentaById.bind);
    }
}
const proveedorRoutes = new ConsultasRoutes();
exports.default = proveedorRoutes.router;
