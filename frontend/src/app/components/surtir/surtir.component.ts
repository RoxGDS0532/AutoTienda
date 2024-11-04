import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service'; 
import { ProveedorService, Proveedor } from '../../services/proveedor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { CategoryFilterPipe } from '../../category-filter.pipe'; // Asegúrate de importar tu pipe


@Component({
  selector: 'app-surtir',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, FormsModule, CategoryFilterPipe],
  templateUrl: './surtir.component.html',
  styleUrl: './surtir.component.css'
})
export class SurtirComponent implements OnInit {
  productos: (Producto & { cantidadSolicitada: number; proveedorId: number | null })[] = [];
  proveedores: Proveedor[] = []; // Lista de proveedores
  categorias: any[] = []; // Para almacenar las categorías
  selectedCategoriaId: number = 0;
  
  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProveedores();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(productos => {
      // Añadir un campo para la cantidad solicitada y el ID del proveedor
      this.productos = productos.map(producto => ({
        ...producto,
        cantidadSolicitada: 0, // Inicializamos con 0
        proveedorId: null // Inicializamos sin proveedor
      }));
    });
  }

  cargarProveedores() {
    this.proveedorService.listarProveedores().subscribe(proveedores => { // Cambio aquí
      this.proveedores = proveedores;
    });
  }

  cargarCategorias() {
    this.productoService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias; // Almacena las categorías
    });
  }

  solicitarProductos() {
    const solicitudes = this.productos
      .filter(producto => producto.cantidadSolicitada > 0)
      .map(producto => ({
        productoId: producto.Id, // Asegúrate de que 'Id' es la propiedad correcta
        proveedorId: producto.proveedorId,
        cantidad: producto.cantidadSolicitada
      }));
  
    console.log('Solicitudes a enviar:', solicitudes); // Log para verificar la estructura
    this.productoService.solicitarProductos(solicitudes).subscribe({
      next: (response) => {
        console.log('Productos solicitados', response);
      },
      error: (error) => {
        console.error('Error al solicitar productos', error);
      }
    });
  }
  
}