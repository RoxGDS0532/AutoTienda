import { Router} from "express";
import categoriaController from "../controllers/categoriaControllers";

class CategoriaRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        this.router.get('/',categoriaController.list);
        this.router.post('/',categoriaController.create);
        this.router.delete('/:Id',categoriaController.delete);
        this.router.put('/:Id',categoriaController.update);
    }
}
const categoriaRoutes=new CategoriaRoutes();
export default categoriaRoutes.router;
    
