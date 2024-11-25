import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';

export class Agotado implements EstadoProducto {
  verificarEstado(producto: Producto): void {
    console.log(`El producto "${producto.Nombre}" está agotado.`);
  }

  solicitar(producto: Producto): void {
    console.log(`No se puede solicitar el producto "${producto.Nombre}" porque está agotado.`);
  }

  sugerirAccion(): string {
    return 'El producto está agotado. Sugerencia: Solicitar al proveedor.';
  }


// solicitar(producto: Producto): void {
//   // En este estado, si el producto está agotado, se podrían sugerir alternativas
//   console.log(`El producto ${producto.Nombre} está agotado. Buscando alternativas similares...`);
//   // Aquí, consumimos la API para obtener productos similares
//   this.productoService.obtenerProductosSimilares(producto.CategoriaId).then((alternativas) => {
//     console.log("Alternativas similares:", alternativas);
//   });
// }

// sugerirAccion(): string {
//   return "Este producto está agotado. Te sugerimos alternativas similares.";
// }
}


