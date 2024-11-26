import { Router} from "express";
import productoRecomController from "../controllers/productosRecomController";
import multer from "multer";


class ProductoRecomendadoRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        const storage = multer.memoryStorage(); 
        const upload = multer({ storage });
        this.router.get('/',productoRecomController.list);
        this.router.get('/:Id', productoRecomController.getOne);
        this.router.post('/',upload.single('Imagen'),productoRecomController.create);
        this.router.delete('/:Id',productoRecomController.delete);
        this.router.put('/:Id',productoRecomController.update);
    }
}
const productoRecomendadoRoutes=new ProductoRecomendadoRoutes();
export default productoRecomendadoRoutes.router;
    
