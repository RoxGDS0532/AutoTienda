import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class Agotado implements EstadoProducto {
  verificarEstado(producto: Producto): void {
    console.log(`El producto "${producto.Nombre}" está agotado.`);
  }

  solicitar(producto: Producto): void {
    console.log(`No se puede solicitar el producto "${producto.Nombre}" porque está agotado.`);
  }

  sugerirAccion(): string {
    return 'El producto está agotado. Sugerencia: Solicitar al proveedor.';
  }
}