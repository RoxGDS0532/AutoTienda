import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';
export class Disponible implements EstadoProducto {
  sugerirAccion(): string {
    return 'El producto está disponible. Sugerencia: No es necesario tomar acción inmediata.';
  }

  verificarEstado(producto: Producto): void {
    console.log(`El producto ${producto.Nombre} está disponible.`);
  }

  solicitar(producto: Producto): void {
    // No se requiere ninguna acción específica
  }
}