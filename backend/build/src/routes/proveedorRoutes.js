"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const proveedorControllers_1 = __importDefault(require("../controllers/proveedorControllers"));
class ProveedorRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', proveedorControllers_1.default.list);
        this.router.post('/', proveedorControllers_1.default.create);
        this.router.delete('/:Id', proveedorControllers_1.default.delete);
        this.router.put('/:Id', proveedorControllers_1.default.update);
    }
}
const proveedorRoutes = new ProveedorRoutes();
exports.default = proveedorRoutes.router;
