import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../../services/producto.service';
import { ProductoSimilar } from '../../services/producto.service'; 
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-detalles-producto',
  standalone: true,
  imports: [CommonModule],
  template: `
  <div *ngFor="let producto of productosSimilares">
    <h3>{{ producto.titulo }}</h3>
    <img [src]="producto.imagen" alt="Imagen de {{ producto.titulo }}" />
    <p>{{ producto.descripcion }}</p>
    <a [href]="producto.enlace" target="_blank">Ver más</a>
  </div>
`,
  templateUrl: './detalles-producto.component.html',
  styleUrl: './detalles-producto.component.css'
})

export class DetallesProductoComponent implements OnInit {
  productosSimilares: ProductoSimilar[] = [];  
  producto: Producto | null = null;

  constructor(private productoService: ProductoService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const nombreProducto = 'Nombre del producto a buscar'; 
    this.productoService.obtenerProductosSimilares(nombreProducto).subscribe(
      (resultados) => (this.productosSimilares = resultados),
      (error) => console.error('Error al obtener productos similares:', error)
    );

    const id = this.route.snapshot.paramMap.get('id');
  if (id !== null) {
    const idNumerico = Number(id); // Convierte a número
    this.obtenerProducto(idNumerico);
  } else {
    console.error('El ID es nulo y no se puede procesar.');
  }
}

obtenerProducto(id: number): void {
  this.productoService.obtenerProductoPorId(id).subscribe({
    next: (producto) => {
      console.log('Producto obtenido:', producto);
      this.producto = producto
    },
    error: (error) => {
      console.error('Error al obtener el producto:', error);
    },
  });
}

}
