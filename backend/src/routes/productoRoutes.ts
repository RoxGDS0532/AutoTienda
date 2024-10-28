import { Router, Request, Response } from "express";

class ProductoRoutes{
    public router:Router=Router();
    constructor(){
        this.config();
    }
    
    config():void{
        this.router.get('/', (req: Request, resp: Response) => {
            resp.send('Hello');
        });
    }
}
const productoRoutes=new ProductoRoutes();
export default productoRoutes.router;
    
