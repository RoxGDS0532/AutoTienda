import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../../services/producto.service';
import { ProductoSimilar } from '../../services/producto.service'; 
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'
import { Agotado } from '../../state-producto/agotado.estado'
import { Disponible } from '../../state-producto/disponible.estado';
import { PorAgotarse } from '../../state-producto/porAgotarse.estado';
import { ContextoProducto } from '../../state-producto/contexto';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';  
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { SugerenciasService } from '../../services/sugerencias.service';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';
import { ProductosRecomendadosService, ProductoRecomendado } from '../../services/productos-recomendados.service';
import { HttpClientModule } from '@angular/common/http';
import { EstadoProducto } from '../../state-producto/producto.interface';
import { CategoryFilterPipe } from '../../category-filter.pipe'; 

@Component({
  selector: 'app-detalles-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalles-producto.component.html',
  styleUrl: './detalles-producto.component.css',
  providers: [ProductoService, ToastrService, CategoriaService,SugerenciasService]
})

export class DetallesProductoComponent implements OnInit {
  producto: Producto | null = null;
  productoR: Producto = { Id: 0, Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0, CodigoBarras: '', ImagenURL: '' };
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = []; 
  productosRecomendados: ProductoRecomendado[] = []; 

  contexto: ContextoProducto;
  sugerencia: string | null = null;
  mostrarRecomendaciones = false;
  sugerencias: any | null = null;
  mostrarSugerencias = false;
  sugerenciass: any[] = []; 
  
  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute, 
    private toastr: ToastrService,
    private sugerenciasService: SugerenciasService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private productosRecomendadosService: ProductosRecomendadosService,
  ) {
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
    this.cargarCategorias();
    this.cargarProveedores();
    this.cargarProductosRecomendados();
  }

  obtenerProducto(id: number): void {
    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (producto) => {
        console.log('Producto obtenido:', producto);
        this.producto = producto;
        this.actualizarEstado(this.producto);
        this.cargarProductosRecomendados();
      },
      error: (error) => {
        console.error('Error al obtener el producto:', error);
      },
    });
  }

  
  cargarProveedores() {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  actualizarEstado(producto: Producto): void {
    this.contexto.verificarEstado(producto);
    if (this.contexto['estado'] instanceof Agotado) {
      this.mostrarRecomendaciones = true;
      this.cargarProductosRecomendados();
    } else if (this.contexto['estado'] instanceof PorAgotarse) {
      this.sugerencias = this.sugerenciasService.generateSugerencias(producto);
      this.mostrarSugerencias = true;
    }
  }

  cargarProductosRecomendados(): void {
    this.productosRecomendadosService.obtenerProductos().subscribe(
      (productoRecomendado) => {
        console.log('Productos recomendados obtenidos:', productoRecomendado);
        // Filtrar los productos recomendados para que coincidan con la categoría del producto seleccionado
        if (this.producto) {
          this.productosRecomendados = productoRecomendado.filter(producto =>
            producto.categoria_id === this.producto?.CategoriaId
          );
        }
      },
      (error) => {
        console.error('Error al obtener productos recomendados:', error);
      }
    );
  }
  



  aceptarSugerencia(sugerencia: any): void {
    console.log('Sugerencia aceptada:', sugerencia);
    this.toastr.success('Sugerencia aceptada correctamente', '¡Éxito!');
  }

  rechazarSugerencia(sugerencia: any): void {
    console.log('Sugerencia rechazada:', sugerencia);
    this.toastr.warning('Sugerencia rechazada', 'Información');
  }

  obtenerProveedorPorCategoria(categoriaId: number): Proveedor | undefined {
    return this.proveedores.find(proveedor => proveedor.Id === categoriaId);
  }
  
  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(categorias => this.categorias = categorias);
  }

  getCategoriaNombre(categoriaId: number | undefined): string {
    if (categoriaId === undefined) {
      return 'Sin categoría'; // O cualquier valor predeterminado que desees
    }
    const categoria = this.categorias.find(cat => cat.Id === categoriaId);
    return categoria ? categoria.Nombre : 'Categoría no encontrada';
  }
  

  limpiarFormulario() {
    this.producto = { Id: 0, ImagenURL: '', Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0, CodigoBarras: '' };
  }
  abrirModalAgregar(producto: Producto): void {
    this.productoR = { ...producto };
    console.log('Producto a autollenar:', this.productoR);
    
    setTimeout(() => {
      const agregarModal = new bootstrap.Modal(document.getElementById('agregarProductoModal')!);
      agregarModal.show(); // Abrir el modal con los datos pre-llenados
    }, 0);
  }

  agregarProducto(): void {
    if (this.productoR) {
      console.log('Producto a agregar:', this.productoR);
      this.productoService.agregarProducto(this.productoR).subscribe({
        next: () => {
          const agregarModal = bootstrap.Modal.getInstance(document.getElementById('agregarProductoModal')!);
          agregarModal?.hide();
          this.toastr.success('Producto agregado correctamente.', '¡Éxito!');
        },
        error: (error) => {
          console.error('Error al agregar el producto:', error);
          this.toastr.error('Hubo un error al agregar el producto.', '¡Error!');
        }
      });
    }
  }
}