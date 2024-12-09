import { Router} from "express";
import productoSurtirController from "../controllers/productosSurtirController";
import multer from "multer";


class ProductoSurtirController{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        const storage = multer.memoryStorage(); 
        const upload = multer({ storage });
        this.router.get('/',productoSurtirController.list);
        this.router.get('/:Id', productoSurtirController.getOne);
        this.router.post('/',upload.single('Imagen'),productoSurtirController.create);
        this.router.delete('/:Id',productoSurtirController.delete);
        this.router.put('/:Id',productoSurtirController.update);
        
    }
}
const productoSurtirRoutes=new ProductoSurtirController();
export default productoSurtirRoutes.router;
    
