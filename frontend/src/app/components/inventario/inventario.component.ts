import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { CommonModule } from '@angular/common';



interface Producto {
  id?: number;
  nombre: string;
  categoria: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  productos: Producto[] = [];
  nuevoProducto: Producto = { nombre: '', categoria: '', precio: 0, cantidad: 0 };
  apiUrl = 'http://localhost:3000/producto'; // Cambia la URL según corresponda

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.obtenerProductos();
  }

  obtenerProductos(): void {
    this.http.get<Producto[]>(this.apiUrl).subscribe(
      (data) => (this.productos = data),
      (error) => console.error('Error al obtener productos:', error)
    );
  }

  agregarProducto(): void {
    this.http.post(this.apiUrl, this.nuevoProducto).subscribe(
      () => {
        this.obtenerProductos(); // Refresca la lista
        this.nuevoProducto = { nombre: '', categoria: '', precio: 0, cantidad: 0 }; // Limpia el formulario
      },
      (error) => console.error('Error al agregar producto:', error)
    );
  }

  editarProducto(producto: Producto): void {
    this.nuevoProducto = { ...producto }; // Carga los datos en el formulario para editar
  }

  actualizarProducto(): void {
    if (this.nuevoProducto.id) {
      this.http.put(`${this.apiUrl}/${this.nuevoProducto.id}`, this.nuevoProducto).subscribe(
        () => {
          this.obtenerProductos();
          this.nuevoProducto = { nombre: '', categoria: '', precio: 0, cantidad: 0 }; // Limpia el formulario
        },
        (error) => console.error('Error al actualizar producto:', error)
      );
    }
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(
        () => this.obtenerProductos(),
        (error) => console.error('Error al eliminar producto:', error)
      );
    }
  }
}
