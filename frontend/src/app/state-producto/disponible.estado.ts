import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class Disponible implements EstadoProducto {
  
  sugerirAccion(): string {
    return 'El producto está disponible. Sugerencia: No es necesario tomar acción inmediata.';
  }

  verificarEstado(producto: Producto): boolean {
    return producto.CantidadDisponible > 5;
  }
}
