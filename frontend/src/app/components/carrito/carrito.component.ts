import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  producto: Producto | undefined;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    const codigoBarras = this.route.snapshot.paramMap.get('codigoBarras');
    if (codigoBarras) {
      this.productoService.obtenerProductoPorCodigoBarras(+codigoBarras)
        .subscribe(
          producto => this.producto = producto,
          error => console.error('Error al obtener el producto:', error)
        );
    }
  }
}
