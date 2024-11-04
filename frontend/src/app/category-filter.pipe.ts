import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'categoryFilter',
  standalone: true
})
export class CategoryFilterPipe implements PipeTransform {

  transform(productos: any[], categoriaId: number): any[] {
    if (!productos || !categoriaId) {
      return productos;
    }
    return productos.filter(producto => producto.CategoriaId === categoriaId);
  }
  
}
