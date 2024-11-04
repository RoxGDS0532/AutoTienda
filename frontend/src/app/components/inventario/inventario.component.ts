import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // Import FormsModule here
import { CommonModule } from '@angular/common';
import { ProductoService } from '../../services/producto.service';
import * as bootstrap from 'bootstrap';

interface Categoria {
  Id: number;
  Nombre: string;
}

interface Producto {
  Id?: number;
  Nombre: string;
  CategoriaId: number; 
  Precio: number;
  Cantidad: number;
  Stock: number;
  Imagen?: File ; 
  CodigoQR?: string; 
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
  categorias: Categoria[] = [];
  nuevoProducto: Producto = {
    Nombre: '',
    CategoriaId: 0,
    Precio: 0,
    Cantidad: 0,
    Stock:0,
    Imagen: undefined, // Agrega la propiedad para la imagen
    CodigoQR: ''
  };
  productoSeleccionado: any = {};
  selectedImage: File | null = null;
  selectedFile: File | null = null;
  imagenFile: File | null = null; // Almacenar el archivo de imagen
  codigoQR: string = ''; // Almacenar el código QR


  constructor(private productoService: ProductoService) {}

  ngOnInit(): void {
    this.obtenerProductos();
    this.obtenerCategorias(); // Obtener categorías al iniciar el componente
  }

  obtenerProductos(): void {
    this.productoService.obtenerProductos().subscribe({
      next: (data) => {
        console.log('Datos recibidos:', data);
        this.productos = data;
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  obtenerCategorias(): void {
    this.productoService.obtenerCategorias().subscribe({
      next: (data) => {
        console.log('Categorías recibidas:', data);
        this.categorias = data; 
      },
      error: (error) => {
        console.error('Error al obtener categorías:', error);
      }
    });
  }
  
  // Método para agregar un producto
  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  agregarProducto(): void {
    const formData = new FormData();
    formData.append('Nombre', this.nuevoProducto.Nombre);
    formData.append('CategoriaId', this.nuevoProducto.CategoriaId.toString());
    formData.append('Precio', this.nuevoProducto.Precio.toString());
    formData.append('Cantidad', this.nuevoProducto.Cantidad.toString());
    formData.append('Stock', this.nuevoProducto.Stock.toString());
    formData.append('CodigoQR', this.nuevoProducto.CodigoQR || '');

    if (this.selectedFile) {
      formData.append('Imagen', this.selectedFile, this.selectedFile.name);
    }

    this.productoService.agregarProducto(formData).subscribe(
      (response) => {
        console.log('Producto agregado:', response);
      },
      (error) => console.error('Error al agregar producto:', error)
    );
  }
  

  
  cargarProductos(): void {
    this.productoService.obtenerProductos().subscribe((data: Producto[]) => {
      this.productos = data;
    });
  }
  
  limpiarFormulario(): void {
    this.productoSeleccionado = { Id: 0, Nombre: '', Precio: 0, Cantidad: 0, Stock: 0, CategoriaId: 0 }; // Restablecer a objeto vacío
    this.imagenFile = null; // Limpiar el archivo de imagen
    this.codigoQR = ''; // Limpiar el código QR
  }
  
  editarProducto(producto: any) {
    this.productoSeleccionado = { ...producto };
  }

  eliminarProducto(id: number): void {
    this.productoService.eliminarProducto(id).subscribe({
      next: () => {
        this.productos = this.productos.filter(producto => producto.Id !== id);
      },
      error: (error) => {
        console.error('Error al eliminar producto:', error);
      }
    });
  }
}