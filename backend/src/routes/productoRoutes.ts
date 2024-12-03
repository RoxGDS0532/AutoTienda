import { Router} from "express";
import productoController from "../controllers/productoControllers";
import multer from "multer";
import { enviarCorreoProveedor } from "../controllers/correoProveedorControllers";

class ProductoRoutes{
    public router:Router=Router();

    constructor(){
        this.config();
    }
    
    config():void{
        const storage = multer.memoryStorage(); 
        const upload = multer({ storage });

        this.router.get('/promocion', productoController.getProductosEnPromocion);

        this.router.get('/codigo/:codigoBarras', productoController.getOneByCodigoBarras);
        this.router.get('/',productoController.list);
        this.router.get('/:Id', productoController.getOne);
        this.router.post('/',upload.single('Imagen'),productoController.create);
        this.router.delete('/:Id',productoController.delete);
        this.router.put('/:Id',productoController.update);
        this.router.post('/enviar', enviarCorreoProveedor);
        this.router.get('/promocion', productoController.getProductosEnPromocion);


        
    }
}
const productoRoutes=new ProductoRoutes();
export default productoRoutes.router;
    
