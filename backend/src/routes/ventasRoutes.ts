import { Router,Request, Response} from "express";
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
        this.router.get('/', (req: Request, res: Response) => {
            res.status(200).json({ message: 'Ruta /ventas disponible, pero usa POST para registrar ventas.' });
          });
          
    }
    
}
const ventasRoutes=new VentasRoutes();
export default ventasRoutes.router;