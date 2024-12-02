import { catchError, map, Observable, of } from 'rxjs';
import { Producto } from '../services/producto.service';
import { ProductoRecomendado, ProductosRecomendadosService } from '../services/productos-recomendados.service';
import { EstadoProducto } from './producto.interface';

export class Agotado implements EstadoProducto {
  private productosRecomendados: ProductoRecomendado[] = [];
  private producto: Producto | null = null; 

  constructor(private productosRecomendadosService: ProductosRecomendadosService) {}

  setProducto(producto: Producto): void {
    this.producto = producto;
    console.log('Producto establecido:', this.producto);
  }

  verificarEstado(producto: Producto): boolean {
    this.setProducto(producto); // Guardar el producto
    console.log(`El producto "${producto.Nombre}" está agotado.`);
    return producto.CantidadDisponible === 0;
  }

  sugerirAccion(): string {
    if (!this.producto) {
      return 'No se ha establecido un producto.';
    }
    if (this.productosRecomendados.length === 0) {
      return 'El producto está agotado. Se están buscando recomendaciones...';
    }
    const nombresProductos = this.productosRecomendados.map(p => p.nombre).join(', ');
    return `El producto "${this.producto.Nombre}" está agotado. Productos recomendados: ${nombresProductos}`;
  }

  // En Agotado.ts
  cargarProductosRecomendados(): Observable<ProductoRecomendado[]> {
    if (!this.producto) {
      console.error('No se ha establecido un producto para cargar recomendaciones.');
      return of([]); // Retorna un observable vacío si no se ha establecido un producto
    }
    console.log(`Cargando productos recomendados para la categoría: ${this.producto.CategoriaId}`);
    return this.productosRecomendadosService.obtenerProductos().pipe(
      map(productosRecomendados => {
        console.log('Productos recomendados obtenidos:', productosRecomendados);
        return productosRecomendados.filter(
          pr => pr.categoria_id === this.producto?.CategoriaId
        );
      }),
      catchError(error => {
        console.error('Error al obtener productos recomendados:', error);
        return of([]); // Retorna un observable vacío en caso de error
      })
    );
  }
  

  
}
