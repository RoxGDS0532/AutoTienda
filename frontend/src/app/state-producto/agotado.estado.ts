import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';
/*Falta acciones aún, solo es estructura :) */
export class Agotado implements EstadoProducto {
  manejarEstado(producto: Producto): void {
    console.log(`El producto ${producto.Nombre} está agotado.`);
  }

  sugerirAccion(): string {
    return 'Solicitar urgentemente al proveedor.';
  }
}
