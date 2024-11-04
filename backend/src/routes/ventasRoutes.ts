import { Router} from "express";
import ventasController from "../controllers/ventasControllers";

class VentasRoutes{
    public router:Router=Router();

    constructor(){  
        this.config();
    }

    config():void{
        this.router.post('/',ventasController.create);
    }
}
const ventasRoutes=new VentasRoutes();
export default ventasRoutes.router;