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
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = require("../../database");
const date_fns_tz_1 = require("date-fns-tz");
class VentasController {
    create(req, resp) {
        return __awaiter(this, void 0, void 0, function* () {
            const mexicoCityTimeZone = 'America/Mexico_City';
            const fechaActual = new Date();
            const fechaEnMexico = (0, date_fns_tz_1.toZonedTime)(fechaActual, mexicoCityTimeZone);
            const fechaVenta = (0, date_fns_tz_1.format)(fechaEnMexico, 'yyyy-MM-dd HH:mm:ss', { timeZone: mexicoCityTimeZone });
            const horaVenta = (0, date_fns_tz_1.format)(fechaEnMexico, 'HH:mm:ss', { timeZone: mexicoCityTimeZone });
            const { pago_total, tipo_pago, detalles } = req.body;
            console.log('Datos recibidos:', { pago_total, tipo_pago, detalles });
            const connection = yield (0, database_1.getConnection)();
            try {
                yield connection.beginTransaction();
                const ventaResult = yield connection.query('INSERT INTO venta (fecha_venta, hora_venta, pago_total, tipo_pago) VALUES (?, ?, ?, ?)', [fechaVenta, horaVenta, pago_total, tipo_pago]);
                const idVenta = ventaResult.insertId;
                for (const detalle of detalles) {
                    console.log('Insertando detalle:', detalle); // <-- Log de cada detalle
                    yield connection.query('INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)', [idVenta, detalle.id_producto, detalle.cantidad, detalle.precio_unitario]);
                }
                yield connection.commit();
                resp.status(201).json({ message: 'Venta registrada exitosamente', ventaId: idVenta });
            }
            catch (error) {
                yield connection.rollback();
                console.error('Error al registrar la venta:', error); // <-- Inspecciona el error aquí
                resp.status(500).json({ message: 'Error al registrar la venta' });
            }
            finally {
                connection.release();
            }
        });
    }
}
const ventasController = new VentasController();
exports.default = ventasController;
