"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const surtirController_1 = __importDefault(require("../controllers/surtirController"));
class SurtirRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/', surtirController_1.default.list);
        this.router.post('/', surtirController_1.default.create);
        this.router.delete('/:id', surtirController_1.default.delete);
        this.router.put('/:id', surtirController_1.default.update);
    }
}
const surtirRoutes = new SurtirRoutes();
exports.default = surtirRoutes.router;
