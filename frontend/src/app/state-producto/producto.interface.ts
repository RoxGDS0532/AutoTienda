import { Producto } from '../services/producto.service'; // Ajusta la ruta según tu estructura

export interface EstadoProducto {
  verificarEstado(producto: Producto): void;
  solicitar(producto: Producto): void; // Para manejar acciones específicas según el estado
  sugerirAccion(): string;
}
