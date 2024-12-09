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
    this.setProducto(producto); 
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

  cargarProductosRecomendados(): Observable<{ [proveedorId: number]: ProductoRecomendado[] }> {
    if (!this.producto) {
      console.error('No se ha establecido un producto para cargar recomendaciones.');
      return of({}); 
    }
    console.log(`Cargando productos recomendados para la categoría: ${this.producto.CategoriaId}`);
    
    return this.productosRecomendadosService.obtenerProductos().pipe(
      map(productosRecomendados => {
        console.log('Productos recomendados obtenidos:', productosRecomendados);
        
        // Filtramos los productos por categoría
        const productosFiltrados = productosRecomendados.filter(
          pr => pr.categoria_id === this.producto?.CategoriaId
        );
        
        // Agrupamos los productos por proveedor_id
        const productosPorProveedor = productosFiltrados.reduce((agrupados, producto) => {
          const proveedorId = producto.id_proveedor; 
          if (!agrupados[proveedorId]) {
            agrupados[proveedorId] = []; 
          }
          agrupados[proveedorId].push(producto); // Agrega el producto a la lista correspondiente
          return agrupados;
        }, {} as { [proveedorId: number]: ProductoRecomendado[] });
        
        console.log('Productos agrupados por proveedor:', productosPorProveedor);
        return productosPorProveedor;
      }),
      catchError(error => {
        console.error('Error al obtener productos recomendados:', error);
        return of({}); 
      })
    );
  }
}