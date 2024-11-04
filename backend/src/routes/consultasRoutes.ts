import { Router } from "express";
import consultasController from "../controllers/consultasControllers";

class ConsultasRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/venta', consultasController.listVenta);
        this.router.get('/pago', consultasController.listPagos);
        this.router.get('/deVenta', consultasController.listDeVenta);
        this.router.get('/producto',consultasController.list);
        this.router.get('/getPagoById/:id', consultasController.getPagoById.bind);
        this.router.get('/getVentaById/:id', consultasController.getVentaById.bind);
        this.router.get('/getDeVentaById/:id', consultasController.getDeVentaById.bind);
    }
}

const proveedorRoutes = new ConsultasRoutes();
export default proveedorRoutes.router;