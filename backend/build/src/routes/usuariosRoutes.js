"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuariosControllers_1 = __importDefault(require("../controllers/usuariosControllers"));
class UsuariosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', usuariosControllers_1.default.list);
        this.router.post('/', usuariosControllers_1.default.create);
        this.router.delete('/:Id', usuariosControllers_1.default.delete);
        this.router.put('/:Id', usuariosControllers_1.default.update);
        this.router.post('/login', usuariosControllers_1.default.login);
    }
}
const usuariosRoutes = new UsuariosRoutes();
exports.default = usuariosRoutes.router;
