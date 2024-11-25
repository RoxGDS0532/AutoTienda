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
import { ContextoProducto } from '../../state-producto/contexto';
import { EstadoProducto } from '../../state-producto/producto.interface';
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
  productosFiltrados: (Producto & { cantidadSolicitada: number; proveedorId: number | null })[] = []; // Agregado
  sugerencias: any[] = []; // Almacena las sugerencias generadas para productos

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

  valuarEstado(producto: Producto): void {
    let estado: EstadoProducto;
  
    if (producto.CantidadDisponible === 0) {
      estado = new Agotado();
    } else if (producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5) {
      estado = new PorAgotarse();
      // Generación de sugerencia solo si hay proveedores y si el proveedor tiene la categoría correcta
      if (this.proveedores.length > 0) {
        const proveedor = this.obtenerProveedorPorCategoria(producto.CategoriaId);
        if (proveedor) {
          this.sugerencias.push({
            productoId: producto.Id,
            productoNombre: producto.Nombre,
            proveedorId: proveedor.Id,
            cantidadPropuesta: 10
          });
        }
      } else {
        console.error(`No hay proveedores disponibles para el producto: ${producto.Nombre}`);
      }
    } else {
      estado = new Disponible();
    }
  
    const contexto = new ContextoProducto(estado);
    producto.estado = estado.constructor.name; // Almacena el estado actual
    producto.sugerencia = contexto.sugerirAccion(); // Almacena la sugerencia
  }

  obtenerProveedorPorCategoria(categoriaId: number): Proveedor | undefined {
    return this.proveedores.find(proveedor => proveedor.Id === categoriaId);
  }

  aceptarSugerencia(sugerencia: any): void {
    if (!sugerencia.proveedorId) {
      alert('Selecciona un proveedor antes de aceptar la sugerencia.');
      return;
    }
  
    const solicitud = {
      productoId: sugerencia.productoId,
      cantidad: sugerencia.cantidadPropuesta,
      proveedorId: sugerencia.proveedorId
    };
  
    this.productoService.solicitarProductos([solicitud]).subscribe(() => {
      this.sugerencias = this.sugerencias.filter(s => s.productoId !== sugerencia.productoId);
      alert(`Pedido aceptado para el producto: ${sugerencia.productoNombre}`);
    });
  }
  
  rechazarSugerencia(sugerencia: any): void {
    // Eliminar la sugerencia actual
    this.sugerencias = this.sugerencias.filter(s => s.productoId !== sugerencia.productoId);

    // Generar una nueva sugerencia con un proveedor diferente que tenga la misma categoría
    const nuevoProveedor = this.obtenerProveedorPorCategoria(sugerencia.productoCategoriaId);
    if (nuevoProveedor) {
      this.sugerencias.push({
        productoId: sugerencia.productoId,
        productoNombre: sugerencia.productoNombre,
        proveedorId: nuevoProveedor.Id,
        cantidadPropuesta: 10
      });
      alert(`Sugerencia actualizada con un nuevo proveedor para el producto: ${sugerencia.productoNombre}`);
    } else {
      alert('No hay más proveedores disponibles para sugerir.');
    }
  }

  
  

  cargarProductos() {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
      this.productoService.obtenerProductos().subscribe(productos => {
        this.productos = productos.map(producto => {
          this.valuarEstado(producto);
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

  solicitarSugerencia(sugerencia: any): void {
    const proveedorId = sugerencia.proveedorId;
    if (!proveedorId) {
      alert('Selecciona un proveedor antes de realizar el pedido.');
      return;
    }

    const solicitud = {
      productoId: sugerencia.productoId,
      cantidad: 10, // Ejemplo: siempre 10 unidades para sugerencias
      proveedorId: proveedorId
    };

    this.productoService.solicitarProductos([solicitud]).subscribe(() => {
      this.sugerencias = this.sugerencias.filter((s) => s.productoId !== sugerencia.productoId);
      alert(`Pedido realizado para el producto: ${sugerencia.productoNombre}`);
    });
  }
}
