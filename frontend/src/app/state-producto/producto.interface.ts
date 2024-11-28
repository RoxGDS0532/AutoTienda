import { Producto } from '../services/producto.service'; 

export interface EstadoProducto {
  verificarEstado(producto: Producto): boolean;
  sugerirAccion(): string;
  solicitar(producto: Producto): void;
}


