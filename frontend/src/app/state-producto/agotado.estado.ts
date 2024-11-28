import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class Agotado implements EstadoProducto {
  verificarEstado(producto: Producto): boolean {
    return producto.CantidadDisponible === 0;
    console.log(`El producto "${producto.Nombre}" está agotado.`);
  }
  
  sugerirAccion(): string {
    return 'El producto está agotado. Sugerencia: Solicitar al proveedor.';
  }



}


