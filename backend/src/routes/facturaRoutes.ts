import { Router } from 'express';
import { generarFactura } from '../controllers/facturaControllers';

const router = Router();

// Ruta para generar la factura
router.post('/generar-factura', generarFactura);

export default router;
