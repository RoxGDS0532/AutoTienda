import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';
import { Agotado } from './agotado.estado';
import { Disponible } from './disponible.estado';
import { PorAgotarse } from './porAgotarse.estado';

export class ContextoProducto {
  private estado: EstadoProducto;

  constructor(estado: EstadoProducto) {
    this.estado = estado;
  }

  setEstado(estado: EstadoProducto): void {
    this.estado = estado;
  }
  
  verificarEstado(producto: Producto): void {
    if (producto.CantidadDisponible === 0) {
      this.estado = new Agotado(); 
    } else if (producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5) {
      this.estado = new PorAgotarse(); 
    } else {
      this.estado = new Disponible(); 
    }
  }

  sugerirAccion(): string {
    return this.estado.sugerirAccion();
  }

}