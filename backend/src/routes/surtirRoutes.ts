import { Router} from "express";
import surtirController from "../controllers/surtirController";

class SurtirRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        this.router.get('/',surtirController.list);
        this.router.post('/',surtirController.create);
        this.router.delete('/:id',surtirController.delete);
        this.router.put('/:id',surtirController.update);
    }
}
const surtirRoutes=new SurtirRoutes();
export default surtirRoutes.router;
    
