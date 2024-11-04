import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter',
  standalone: true
})
export class CategoryFilterPipe implements PipeTransform {

  transform(productos: any[], categoriaId: number): any[] {
    if (!productos || categoriaId === 0) {
      return productos; // Devuelve todos los productos si no hay un filtrado específico
    }
    return productos.filter(producto => producto.CategoriaId === categoriaId);
  }
  
}
