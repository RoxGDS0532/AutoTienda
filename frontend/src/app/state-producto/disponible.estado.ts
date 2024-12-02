import { EstadoProducto } from './producto.interface';
import { Producto, ProductoService } from '../services/producto.service';

export class Disponible implements EstadoProducto {
  constructor(private productoService: ProductoService) {}

  sugerirAccion(producto: Producto): void {
    if (this.verificarEstado(producto)) {
      this.productoService.obtenerProductosPromocion().subscribe((productosEnPromocion) => {
        const estaEnPromocion = productosEnPromocion.some(
          (p) => p.Id === producto.Id
        );

        if (estaEnPromocion) {
          console.log(
            `El producto "${producto.Nombre}" está en promoción con un precio reducido de $${producto.PrecioConDescuento}.`
          );
          this.destacarProducto(producto); 
        } else {
          console.log(
            `El producto "${producto.Nombre}" está disponible pero no tiene promoción activa.`
          );
        }
      });
    } else {
      console.log(
        `El producto "${producto.Nombre}" no está disponible con más de 5 unidades.`
      );
    }
  }

  verificarEstado(producto: Producto): boolean {
    return producto.CantidadDisponible > 5; 
  }

  // Acción adicional para destacar el producto en la interfaz
  private destacarProducto(producto: Producto): void {
    console.log(`Destacando producto: ${producto.Nombre}`);
    // Aquí puedes incluir lógica para actualizar el DOM o llamar a un servicio
    // Por ejemplo, actualizar una propiedad en un objeto compartido para reflejarlo en la UI
  }
}