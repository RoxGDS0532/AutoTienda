import express,{Application} from 'express';
import productoRoutes from './routes/productoRoutes'
import morgan from 'morgan';
import cors from 'cors';
import proveedorRoutes from './routes/proveedorRoutes'
import usuariosRoutes from './routes/usuariosRoutes'
import consultasRoutes from './routes/consultasRoutes'
import ventasRoutes from './routes/ventasRoutes';

class Server{
    public app: Application;
    constructor(){
        this.app = express();
        this.config();
        this.routes();

    }
    config() : void{
        this.app.set('port',process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended : false}));
    }
    routes() : void{
        this.app.use('/producto', productoRoutes)
        this.app.use('/ventas', ventasRoutes)
        this.app.use('/proveedor', proveedorRoutes)
        this.app.use('/usuario',usuariosRoutes)
        this.app.use('/consulta',consultasRoutes)
    }
    start() : void{
        console.log('Iniciando el servidor...');
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
    
}
const server = new Server();
server.start();