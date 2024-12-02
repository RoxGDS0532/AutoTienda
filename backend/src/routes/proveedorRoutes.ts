import { Router,Request, Response } from "express";

import proveedorController from "../controllers/proveedorControllers"; // Verifica que esta ruta sea correcta

class ProveedorRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', proveedorController.list.bind(proveedorController)); // Usar bind
        this.router.post('/', proveedorController.create.bind(proveedorController)); // Usar bind
        this.router.delete('/:Id', proveedorController.delete.bind(proveedorController));
        this.router.put('/:Id', proveedorController.update.bind(proveedorController)); // Usar bind

    }   
}

const proveedorRoutes = new ProveedorRoutes();
export default proveedorRoutes.router;
