import { Router} from "express";
import proveedorController from "../controllers/proveedorControllers";

class ProveedorRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        this.router.get('/',proveedorController.list);
        this.router.post('/',proveedorController.create);
        this.router.delete('/:Id',proveedorController.delete);
        this.router.put('/:Id',proveedorController.update);
    }
}
const proveedorRoutes=new ProveedorRoutes();
export default proveedorRoutes.router;
    
