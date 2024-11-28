import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class Agotado implements EstadoProducto {
  verificarEstado(producto: Producto): boolean {
    console.log(`El producto "${producto.Nombre}" está agotado.`);
    return producto.CantidadDisponible === 0;
  }
  
  sugerirAccion(): string {
    return 'El producto está agotado. Sugerencia: Solicitar al proveedor.';
   }



}


