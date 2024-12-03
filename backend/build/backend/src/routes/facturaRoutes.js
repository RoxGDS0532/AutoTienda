"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const facturaControllers_1 = require("../controllers/facturaControllers");
const router = (0, express_1.Router)();
// Ruta para generar la factura
router.post('/generar-factura', facturaControllers_1.generarFactura);
exports.default = router;
