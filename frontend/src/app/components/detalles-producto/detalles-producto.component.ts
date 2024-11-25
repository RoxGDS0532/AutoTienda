import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../../services/producto.service';
import { ProductoSimilar } from '../../services/producto.service'; 
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'
import { Agotado } from '../../state-producto/agotado.estado'
import { Disponible } from '../../state-producto/disponible.estado';
import { ContextoProducto } from '../../state-producto/contexto';

@Component({
  selector: 'app-detalles-producto',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles-producto.component.html',
  styleUrl: './detalles-producto.component.css'
})

export class DetallesProductoComponent implements OnInit {
  productosSimilares: ProductoSimilar[] = [];  
  producto: Producto | null = null;

  productosRecomendados = [
    { Nombre: 'Producto 1', Categoria: 'Categoría 1', Precio: 50, ImagenURL: 'https://via.placeholder.com/150' },
    { Nombre: 'Producto 2', Categoria: 'Categoría 2', Precio: 60, ImagenURL: 'https://via.placeholder.com/150' }
  ];

  contexto: ContextoProducto;
  sugerencia: string | null = null;
  mostrarRecomendaciones = false;
  
  constructor(private productoService: ProductoService, private route: ActivatedRoute,) {
    this.contexto = new ContextoProducto(new Disponible());
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
  if (id !== null) {
    const idNumerico = Number(id); 
    this.obtenerProducto(idNumerico);
  } else {
    console.error('El ID es nulo y no se puede procesar.');
  }
}

obtenerProducto(id: number): void {
  this.productoService.obtenerProductoPorId(id).subscribe({
    next: (producto) => {
      console.log('Producto obtenido:', producto);
      this.producto = producto;
      this.actualizarEstado(this.producto);
    },
    error: (error) => {
      console.error('Error al obtener el producto:', error);
    },
  });
}

actualizarEstado(producto: Producto): void {
  this.contexto.verificarEstado(producto);
  this.sugerencia = this.contexto.sugerirAccion();
  // Mostrar recomendaciones solo si el estado es 'Agotado'
  this.mostrarRecomendaciones = this.contexto['estado'] instanceof Agotado;
}



}
