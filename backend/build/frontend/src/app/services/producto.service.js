"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductoService = void 0;
const core_1 = require("@angular/core");
let ProductoService = (() => {
    let _classDecorators = [(0, core_1.Injectable)({
            providedIn: 'root'
        })];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    var ProductoService = _classThis = class {
        constructor(http) {
            this.http = http;
            this.apiUrl = 'http://localhost:3000/producto';
            this.solicitarUrl = 'http://localhost:3000/solicitar';
        }
        // Obtener todos los productos
        obtenerProductos() {
            return this.http.get(this.apiUrl);
        }
        obtenerCategorias() {
            return this.http.get('http://localhost:3000/categoria');
        }
        obtenerProductosSimilares(nombreProducto) {
            return this.http.get(`${this.apiUrl}/similares?nombre=${nombreProducto}`);
        }
        // Obtener un producto por su ID
        obtenerProductoPorId(id) {
            return this.http.get(`${this.apiUrl}/${id}`);
        }
        // Crear un nuevo producto
        agregarProducto(producto) {
            return this.http.post(this.apiUrl, producto);
        }
        // Actualizar un producto existente
        actualizarProducto(Id, Producto) {
            return this.http.put(`${this.apiUrl}/${Id}`, Producto);
        }
        // Eliminar un producto
        eliminarProducto(id) {
            return this.http.delete(`${this.apiUrl}/${id}`);
        }
        // Obtener un producto por su código de barras
        obtenerProductoPorCodigoBarras(codigoBarras) {
            return this.http.get(`${this.apiUrl}/codigo/${codigoBarras}`);
        }
        solicitarProductos(solicitudes) {
            return this.http.post(this.solicitarUrl, solicitudes);
        }
    };
    __setFunctionName(_classThis, "ProductoService");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        ProductoService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return ProductoService = _classThis;
})();
exports.ProductoService = ProductoService;
