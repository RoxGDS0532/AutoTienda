"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const productoControllers_1 = __importDefault(require("../controllers/productoControllers"));
class ProductoRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', productoControllers_1.default.list);
        this.router.post('/', productoControllers_1.default.create);
        this.router.delete('/:Id', productoControllers_1.default.delete);
        this.router.put('/:Id', productoControllers_1.default.update);
    }
}
const productoRoutes = new ProductoRoutes();
exports.default = productoRoutes.router;
