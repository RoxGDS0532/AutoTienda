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
  selectedCategoriaId: number=0 ;
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

  evaluarEstado(producto: Producto): void {
    let estado: EstadoProducto;
  
    if (producto.Cantidad === 0) {
      estado = new Agotado();
    } else if (producto.Cantidad > 0 && producto.Cantidad <= 5) {
      estado = new PorAgotarse();
    } else {
      estado = new Disponible();
    }
  
    const contexto = new ContextoProducto(estado);
    producto.estado = estado.constructor.name; // Almacena el estado actual
    producto.sugerencia = contexto.sugerirAccion(); // Almacena la sugerencia
  }
  
  

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(productos => {
      console.log('Productos cargados:', productos); // Para depuración
      this.productos = productos.map(producto => {
        this.evaluarEstado(producto); // Evalúa el estado del producto
        return { ...producto, cantidadSolicitada: 0, proveedorId: null };
      });
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

  onCategoriaChange(event: any) {
    console.log('Categoría seleccionada:', event); // Log para verificar la categoría seleccionada
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