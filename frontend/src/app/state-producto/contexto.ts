import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class ContextoProducto {
  private estado: EstadoProducto;

  constructor(estado: EstadoProducto) {
    this.estado = estado;
  }

  setEstado(estado: EstadoProducto): void {
    this.estado = estado;
  }

  verificarEstado(producto: Producto): void {
    this.estado.verificarEstado(producto);
  }

  solicitar(producto: Producto): void {
    this.estado.solicitar(producto);
  }

  sugerirAccion(): string {
    return this.estado.sugerirAccion();
  }
}
