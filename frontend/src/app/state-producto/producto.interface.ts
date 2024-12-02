import { Producto } from '../services/producto.service'; 

export interface EstadoProducto {
  verificarEstado(producto: Producto): void;
  sugerirAccion(producto: Producto): void;
}



