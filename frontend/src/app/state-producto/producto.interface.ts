import { Producto } from '../services/producto.service';

export interface EstadoProducto {
  manejarEstado(producto: Producto): void;
  sugerirAccion(): string;
}