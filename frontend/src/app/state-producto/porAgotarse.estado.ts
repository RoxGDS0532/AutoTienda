import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';
export class PorAgotarse implements EstadoProducto {
  sugerirAccion(): string {
    return 'El producto está en punto de agotarse. Sugerencia: Reabastecer pronto.';
  }

  verificarEstado(producto: Producto): boolean {
    console.log(`El producto "${producto.Nombre}" está en punto de agotarse.`);
    return producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5;
  }

  solicitar(producto: Producto): void {
    console.log(`No se puede solicitar el producto "${producto.Nombre}" porque está agotado.`);
  }
}