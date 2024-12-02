import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../services/producto.service';
import { Disponible } from '../state-producto/disponible.estado';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-productos-promocion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './productos-promocion.component.html',
  styleUrl: './productos-promocion.component.css'
})
export class ProductosPromocionComponent implements OnInit {
  productos: Producto[] = [];
  productosEnPromocion: Producto[] = [];

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    // Obtener los productos del servicio
    this.productoService.obtenerProductos().subscribe((productos) => {
      this.productos = productos;
      this.verificarPromociones();
    });
  }

  verificarPromociones(): void {
    const estadoDisponible = new Disponible(this.productoService);
  
    this.productos.forEach((producto) => {
      estadoDisponible.sugerirAccion(producto);
      
      const precioConDescuento = producto.PrecioConDescuento ?? 0;
  
      if (precioConDescuento < producto.Precio) {
        this.productosEnPromocion.push(producto); 
      }
    });
  }
  
}