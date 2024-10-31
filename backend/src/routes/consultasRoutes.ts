import { Router } from "express";
import consultasController from "../controllers/consultasControllers";

class ConsultasRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/venta', consultasController.listVentas.bind(consultasController));
        this.router.get('/pago', consultasController.listPagos.bind(consultasController));
        this.router.get('/recibo', consultasController.listRecibos.bind(consultasController));
    }
}

const proveedorRoutes = new ConsultasRoutes();
export default proveedorRoutes.router;