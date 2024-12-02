"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const emailControllers_1 = __importDefault(require("../controllers/emailControllers"));
const router = (0, express_1.Router)();
// Ruta para enviar correos con los detalles del pedido
router.post('/send-order-email', emailControllers_1.default.sendOrderEmail);
exports.default = router;
