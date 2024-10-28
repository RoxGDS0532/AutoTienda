import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import * as bootstrap from 'bootstrap';



interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
  stock:number;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css',
  providers: [ProductoService]
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  nuevoProducto: Producto = {
    nombre: '',
    categoria: '',
    precio: 0,
    cantidad: 0,
    stock:0
  };

  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data); // Registra para verificar la estructura de los datos
        this.productos = data; // Suponiendo que los datos son un array de Productos
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }
  

  // Método para agregar un producto
  agregarProducto(): void {
    this.productoService.agregarProducto(this.nuevoProducto).subscribe({
      next: (producto) => {
        this.productos.push(producto);
        this.nuevoProducto = { nombre: '', categoria: '', precio: 0, cantidad: 0, stock: 0 };

        // Cerrar el modal usando Bootstrap
        const modalElement = document.getElementById('addProductModal');
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement);
          if (modalInstance) {
            modalInstance.hide();
          }
        } else {
          console.error('El elemento del modal no se encontró');
        }
      },
      error: (error) => {
        console.error('Error al agregar producto:', error);
      }
    });
  }
  

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(producto => producto.id !== id);
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
      }
    });
  }
}