"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ventasControllers_1 = __importDefault(require("../controllers/ventasControllers"));
class VentasRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/', ventasControllers_1.default.create);
    }
}
const ventasRoutes = new VentasRoutes();
exports.default = ventasRoutes.router;