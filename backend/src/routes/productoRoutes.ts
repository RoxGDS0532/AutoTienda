import { Router, Request, Response } from "express";
import productoController from "../controllers/productoControllers";

class ProductoRoutes{
    public router:Router=Router();
    constructor(){
        this.config();
    }
    
    config():void{
        this.router.get('/',productoController.list);
        this.router.post('/',productoController.create);
        this.router.delete('/:Id',productoController.delete);
        this.router.put('/:Id',productoController.update);
    }
}
const productoRoutes=new ProductoRoutes();
export default productoRoutes.router;
    
