import { EstadoProducto } from './producto.interface';
import { Producto, ProductoService } from '../services/producto.service';
import { Agotado } from './agotado.estado';
import { Disponible } from './disponible.estado';
import { PorAgotarse } from './porAgotarse.estado';
import { ProductosRecomendadosService } from '../services/productos-recomendados.service';
import { ProveedorService } from '../services/proveedor.service';

export class ContextoProducto {
  public estado: EstadoProducto;
  private productosRecomendadosService: ProductosRecomendadosService;
  private proveedorService: ProveedorService;
  private sugerenciasService: any;
  private productoService:ProductoService;
  
  constructor(
    estado: EstadoProducto,
    productosRecomendadosService: ProductosRecomendadosService,
    proveedorService: ProveedorService,
    productoService:ProductoService,
    sugerenciasService: any
  ) {
    this.estado = estado;
    this.productosRecomendadosService = productosRecomendadosService;
    this.proveedorService = proveedorService;
    this.sugerenciasService = sugerenciasService;
    this.productoService=productoService;
  }

  setEstado(estado: EstadoProducto): void {
    this.estado = estado;
  }


  verificarEstado(producto: Producto): void {
    if (producto.CantidadDisponible === 0) {
      this.estado = new Agotado(this.productosRecomendadosService); 
    } else if (producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5) {
      this.estado = new PorAgotarse(this.proveedorService, this.sugerenciasService); 
    } else {
      this.setEstado(new Disponible(this.productoService));
    }
    this.estado.verificarEstado(producto);
  }

  sugerirAccion(producto: Producto): void {
    return this.estado.sugerirAccion(producto);
  }

  

}