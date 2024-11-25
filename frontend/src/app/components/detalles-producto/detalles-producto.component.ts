import { Component, OnInit } from '@angular/core';
import { ProductoService } from '../../services/producto.service';
import { ProductoSimilar } from '../../services/producto.service'; 

@Component({
  selector: 'app-detalles-producto',
  standalone: true,
  imports: [],
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

  constructor(private productoService: ProductoService) {}

  ngOnInit() {
    const nombreProducto = 'Nombre del producto a buscar'; 
    this.productoService.obtenerProductosSimilares(nombreProducto).subscribe(
      (resultados) => (this.productosSimilares = resultados),
      (error) => console.error('Error al obtener productos similares:', error)
    );
}
}
