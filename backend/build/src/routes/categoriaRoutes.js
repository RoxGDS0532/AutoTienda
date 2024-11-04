"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categoriaControllers_1 = __importDefault(require("../controllers/categoriaControllers"));
class CategoriaRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', categoriaControllers_1.default.list);
        this.router.post('/', categoriaControllers_1.default.create);
        this.router.delete('/:Id', categoriaControllers_1.default.delete);
        this.router.put('/:Id', categoriaControllers_1.default.update);
    }
}
const categoriaRoutes = new CategoriaRoutes();
exports.default = categoriaRoutes.router;
