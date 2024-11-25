import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class EstadoPorAgotarse implements EstadoProducto {
  manejarEstado(producto: Producto): void {
    if (producto.Cantidad > 0 && producto.Cantidad <= 10) {
      console.log(`El producto "${producto.Nombre}" está por agotarse.`);
    }
  }

  sugerirAccion(): string {
    return 'Se recomienda realizar un pedido al proveedor para evitar agotamiento.';
  }
}
