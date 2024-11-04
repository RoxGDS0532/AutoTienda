import { Router} from "express";
import ventasController from "../controllers/ventasControllers";
import { envioCorreo } from "../controllers/correoControllers";

class VentasRoutes{
    public router:Router=Router();

    constructor(){  
        this.config();
    }

    config():void{
        this.router.post('/',ventasController.create);
        this.router.post('/envio', envioCorreo);
    }
    
}
const ventasRoutes=new VentasRoutes();
export default ventasRoutes.router;