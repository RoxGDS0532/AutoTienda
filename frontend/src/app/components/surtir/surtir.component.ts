import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service'; 
import { ProveedorService, Proveedor } from '../../services/proveedor.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { Agotado } from '../../state-producto/agotado.estado';
import { PorAgotarse } from '../../state-producto/porAgotarse.estado';
import { Disponible } from '../../state-producto/disponible.estado';

import { EstadoProducto } from '../../state-producto/producto.interface';
import { CategoryFilterPipe } from '../../category-filter.pipe'; // Asegúrate de importar tu pipe
import { ContextoProducto } from '../../state-producto/contexto';

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
  productosFiltrados: (Producto & { cantidadSolicitada: number; proveedorId: number | null })[] = []; // Agregado
  sugerencias: any[] = []; // Almacena las sugerencias generadas para productos
  //contexto: ContextoProducto;

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService,
  ) {}
  //{this.contexto = new ContextoProducto(new Disponible());}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProveedores();
    this.cargarCategorias();
    
  }

  /*valuarEstado(producto: Producto): void {
  this.contexto.verificarEstado(producto);
  let estado: EstadoProducto;

  if (this.contexto['estado'] instanceof Agotado) {
    estado = new Agotado();
  } else if (this.contexto['estado'] instanceof PorAgotarse) {
    estado = new PorAgotarse();
  } else {
    estado = new Disponible();
  }
    const contexto = new ContextoProducto(estado);
    producto.estado = estado.constructor.name; // Almacena el estado actual
    producto.sugerencia = contexto.sugerirAccion();
  }*/

  obtenerProveedorPorCategoria(categoriaId: number): Proveedor | undefined {
    return this.proveedores.find(proveedor => proveedor.Id === categoriaId);
  }

  cargarProductos() {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
      this.productoService.obtenerProductos().subscribe(productos => {
        this.productos = productos.map(producto => {
          //this.valuarEstado(producto);
          return { ...producto, cantidadSolicitada: 0, proveedorId: null };
        });
        this.productosFiltrados = [...this.productos];
      });
    });
  }
  

  cargarProveedores() {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  filtrarPorCategoria() {
    if (this.selectedCategoriaId) {
      this.productosFiltrados = this.productos.filter(producto => producto.CategoriaId === this.selectedCategoriaId);
    } else {
      this.productosFiltrados = [...this.productos];
    }
  }

  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(categorias => {
      this.categorias = categorias;
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
