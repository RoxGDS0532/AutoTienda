import { Router } from 'express';
import emailController from '../controllers/emailControllers';

const router = Router();

// Ruta para enviar correos con los detalles del pedido
router.post('/send-order-email', emailController.sendOrderEmail);

export default router;
