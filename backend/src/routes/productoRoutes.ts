import { Router} from "express";
import productoController from "../controllers/productoControllers";
import multer from "multer";


class ProductoRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        const storage = multer.memoryStorage(); // Cambia a diskStorage si prefieres guardar el archivo en el disco
        const upload = multer({ storage });
        
        this.router.get('/',productoController.list);
        this.router.post('/',upload.single('Imagen'),productoController.create);
        this.router.delete('/:Id',productoController.delete);
        this.router.put('/:Id',productoController.update);
    }
}
const productoRoutes=new ProductoRoutes();
export default productoRoutes.router;
    
