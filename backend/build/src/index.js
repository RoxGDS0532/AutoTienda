"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productoRoutes_1 = __importDefault(require("./routes/productoRoutes"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const proveedorRoutes_1 = __importDefault(require("./routes/proveedorRoutes"));
const usuariosRoutes_1 = __importDefault(require("./routes/usuariosRoutes"));
const consultasRoutes_1 = __importDefault(require("./routes/consultasRoutes"));
const ventasRoutes_1 = __importDefault(require("./routes/ventasRoutes"));
const categoriaRoutes_1 = __importDefault(require("./routes/categoriaRoutes"));
const surtirRoutes_1 = __importDefault(require("./routes/surtirRoutes"));
const productoRecomRoutes_1 = __importDefault(require("./routes/productoRecomRoutes"));
const emailRoutes_1 = __importDefault(require("./routes/emailRoutes"));
const productoSurtirRoutes_1 = __importDefault(require("./routes/productoSurtirRoutes"));
class Server {
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
    }
    routes() {
        this.app.use('/producto', productoRoutes_1.default);
        this.app.use('/productoRecomendado', productoRecomRoutes_1.default);
        this.app.use('/productosSurtir', productoSurtirRoutes_1.default);
        this.app.use('/ventas', ventasRoutes_1.default);
        this.app.use('/proveedor', proveedorRoutes_1.default);
        this.app.use('/usuario', usuariosRoutes_1.default);
        this.app.use('/categoria', categoriaRoutes_1.default);
        this.app.use('/solicitar', surtirRoutes_1.default);
        this.app.use('/consulta', consultasRoutes_1.default);
        this.app.use('/email', emailRoutes_1.default);
    }
    start() {
        console.log('Iniciando el servidor...');
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
