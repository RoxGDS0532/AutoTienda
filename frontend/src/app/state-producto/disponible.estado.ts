import { EstadoProducto } from './producto.interface';
import { Producto, ProductoService } from '../services/producto.service';

export class Disponible implements EstadoProducto {
  private productosEnPromocion: Producto[] = [];

  constructor(private productoService: ProductoService, productosEnPromocion?: Producto[]) {
    if (productosEnPromocion) {
      this.productosEnPromocion = productosEnPromocion;
    }
  }

  sugerirAccion(producto: Producto): void {
    if (this.verificarEstado(producto)) {
      if (this.productosEnPromocion.length) {
        const estaEnPromocion = this.productosEnPromocion.some(
          (p) => p.Id === producto.Id
        );
      }
    }
  }

  verificarEstado(producto: Producto): boolean {
    return producto.CantidadDisponible > 5; 
  }

  private destacarProducto(producto: Producto): void {
    console.log(`Destacando producto: ${producto.Nombre}`);
  }
}