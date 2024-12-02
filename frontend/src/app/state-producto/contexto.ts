import { EstadoProducto } from './producto.interface';
import { Producto, ProductoService } from '../services/producto.service';
import { Agotado } from './agotado.estado';
import { Disponible } from './disponible.estado';
import { PorAgotarse } from './porAgotarse.estado';

export class ContextoProducto {
  private estado: EstadoProducto;
  private productoService: ProductoService;

  constructor(estado: EstadoProducto, productoService: ProductoService) {
    this.estado = estado;
    this.productoService = productoService;
  }

  setEstado(estado: EstadoProducto): void {
    this.estado = estado;
  }

  verificarEstado(producto: Producto): void {
    if (producto.CantidadDisponible === 0) {
      this.setEstado(new Agotado());
    } else if (producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5) {
      this.setEstado(new PorAgotarse());
    } else {
      this.setEstado(new Disponible(this.productoService));
    }
    this.estado.verificarEstado(producto);
  }

  sugerirAccion(producto: Producto): void {
    return this.estado.sugerirAccion(producto);
  }
}