import { Router} from "express";
import usuarioController from "../controllers/usuariosControllers";

class UsuariosRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        this.router.get('/',usuarioController.list);
        this.router.post('/',usuarioController.create);
        this.router.delete('/:Id',usuarioController.delete);
        this.router.put('/:Id',usuarioController.update);
        this.router.post('/login', usuarioController.login); 
    }
}
const usuariosRoutes=new UsuariosRoutes();
export default usuariosRoutes.router;
    
