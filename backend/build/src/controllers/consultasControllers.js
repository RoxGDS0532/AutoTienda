"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../database")); // Asegúrate de que esta ruta sea correcta
class ConsultasController {
    // Método para listar todas las ventas
    listVentas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const venta = yield database_1.default.query('SELECT * FROM Ventas');
                res.json(venta);
            }
            catch (error) {
                console.error('Error en listVentas:', error);
                res.status(500).json({ error: 'Error al obtener ventas' });
            }
        });
    }
    // Método para obtener una venta por su ID
    getVentaById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const venta = yield database_1.default.query('SELECT * FROM ventas WHERE Id = ?', [id]);
                if (venta.length > 0) {
                    return res.json(venta[0]);
                }
                res.status(404).json({ text: 'Sin datos' });
            }
            catch (error) {
                console.error('Error en getVentaById:', error);
                res.status(500).json({ error: 'Error al obtener la venta' });
            }
        });
    }
    // Método para listar todos los pagos
    listPagos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const pago = yield database_1.default.query('SELECT * FROM Pagos');
                res.json(pago);
            }
            catch (error) {
                console.error('Error en listPagos:', error);
                res.status(500).json({ error: 'Error al obtener pagos' });
            }
        });
    }
    // Método para obtener un pago por su ID
    getPagoById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const pago = yield database_1.default.query('SELECT * FROM pagos WHERE Id = ?', [id]);
                if (pago.length > 0) {
                    return res.json(pago[0]);
                }
                res.status(404).json({ text: 'Sin datos' });
            }
            catch (error) {
                console.error('Error en getPagoById:', error);
                res.status(500).json({ error: 'Error al obtener el pago' });
            }
        });
    }
    // Método para listar todos los recibos
    listRecibos(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const recibo = yield database_1.default.query('SELECT * FROM ResumenRecibos');
                res.json(recibo);
            }
            catch (error) {
                console.error('Error en listRecibos:', error);
                res.status(500).json({ error: 'Error al obtener recibos' });
            }
        });
    }
    // Método para obtener un recibo por su ID
    getReciboById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { id } = req.params;
            try {
                const recibo = yield database_1.default.query('SELECT * FROM ResumenRecibos WHERE Id = ?', [id]);
                if (recibo.length > 0) {
                    return res.json(recibo[0]);
                }
                res.status(404).json({ text: 'Sin datos' });
            }
            catch (error) {
                console.error('Error en getReciboById:', error);
                res.status(500).json({ error: 'Error al obtener el recibo' });
            }
        });
    }
}
const consultasController = new ConsultasController();
exports.default = consultasController;
