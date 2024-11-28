import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class Disponible implements EstadoProducto {
  
  sugerirAccion(): string {
    return 'El producto está disponible. Sugerencia: No es necesario tomar acción inmediata.';
  }

  verificarEstado(producto: Producto): boolean {
    // Asegúrate de que DiasDisponible esté definido antes de usarlo
    if (producto.DiasDisponible !== undefined && producto.CantidadDisponible > 5 && producto.DiasDisponible > 30) {
      this.aplicarDescuento(producto);  // Aplica el descuento si cumple las condiciones
      this.notificarDescuento(producto); // Notifica al usuario sobre el descuento
    }
    return producto.CantidadDisponible > 5;
  }
  
  // Método para aplicar un descuento automático
  private aplicarDescuento(producto: Producto): void {
    if (producto.DiasDisponible !== undefined && producto.DiasDisponible > 30 && producto.CantidadDisponible > 5) {
      producto.DescuentoAplicado = 0.10;  // 10% de descuento
      producto.PrecioConDescuento = producto.Precio - (producto.Precio * producto.DescuentoAplicado);  // Aplica el descuento al precio
    }
  }

  // Método para notificar al usuario que el producto está en oferta
  private notificarDescuento(producto: Producto): void {
    alert(`¡El producto ${producto.Nombre} tiene un descuento del 10%!`);
  }
}
