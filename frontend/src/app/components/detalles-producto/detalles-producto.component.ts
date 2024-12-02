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
  mensaje: string = '';
  
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
    }  else if (this.contexto['estado'] instanceof PorAgotarse) {
      const nuevaSugerencia = this.sugerenciasService.generateSugerencias(producto);
      if (nuevaSugerencia) {
          this.sugerencias = [nuevaSugerencia];
          this.mostrarSugerencias = true;
      } else {
          console.warn('No se generó ninguna sugerencia para el producto:', producto.Nombre);
      }
  }
  }
  

  generarSugerencia(producto: Producto): void {
    const nuevaSugerencia = this.sugerenciasService.generateSugerencias(producto);
    if (nuevaSugerencia) {
      this.sugerencias = [nuevaSugerencia];
      this.mostrarSugerencias = true;
    } else {
      this.mostrarSugerencias = false;
      console.error('No se pudo generar una sugerencia');
    }
  }

  aceptarSugerencia(sugerencia: any): void {
    console.log('Sugerencia aceptada:', sugerencia);
  
    // Actualizar estado del producto
    this.contexto.setEstado(new Disponible());
    this.mostrarSugerencias = false;
    this.sugerencias = []; // Limpiar sugerencias
  
    // Mostrar mensaje de espera
    this.mensaje = `En espera de surtir el producto "${sugerencia.productoNombre}".`;
  }

  rechazarSugerencia(sugerencia: any): void {
    const index = this.sugerencias.findIndex((s: any) => s === sugerencia);

    if (index > -1) {
      this.sugerencias.splice(index, 1);
    }
  
    if (this.sugerencias.length === 0) {
      const nuevaSugerencia = this.sugerenciasService.generarMultiplesSugerencias({
        Id: sugerencia.productoId,
        Nombre: sugerencia.productoNombre,
        CategoriaId: sugerencia.productoCategoriaId,
        Precio: 0,
        CantidadDisponible: 0,
        CodigoBarras: '',
      });
  
      this.sugerencias = nuevaSugerencia;
      this.mostrarSugerencias = this.sugerencias.length > 0;
    }
  }
  

  cargarProductosRecomendados(): void {
    this.productosRecomendadosService.obtenerProductos().subscribe(
      (productoRecomendado) => {
        console.log('Productos recomendados obtenidos:', productoRecomendado);
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
  

  obtenerProveedorPorCategoria(categoriaId: number): Proveedor | undefined {
    return this.proveedores.find(proveedor => proveedor.Id === categoriaId);
  }
  
  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(categorias => this.categorias = categorias);
  }

  getCategoriaNombre(categoriaId: number | undefined): string {
    if (categoriaId === undefined) {
      return 'Sin categoría'; 
    }
    const categoria = this.categorias.find(cat => cat.Id === categoriaId);
    return categoria ? categoria.Nombre : 'Categoría no encontrada';
  }
  

  limpiarFormulario() {
    this.producto = { Id: 0, ImagenURL: '', Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0, CodigoBarras: '' };
  }
  
  abrirModalAgregar(producto: Producto | undefined): void {
    if (producto && producto.Id !== undefined && producto.Id > 0 && producto.Nombre !== '') {
      this.productoR = { ...producto };
      console.log('Producto a autollenar:', this.productoR);
    } else {
      console.error('Producto no válido:', producto);
      this.toastr.error('Producto no válido. Por favor, selecciona un producto antes de proceder.', '¡Error!');
    }
  
    setTimeout(() => {
      const agregarModal = new bootstrap.Modal(document.getElementById('agregarProductoModal')!);
      agregarModal.show();
    }, 0);
  }
  
  

  seleccionarProducto(producto: ProductoRecomendado): void {
    console.log('Producto recomendado seleccionado:', producto);
    
    const productoTransformado: Producto = {
      Id: producto.id,
      Nombre: producto.nombre,
      Precio: producto.precio,
      CategoriaId: producto.categoria_id,
      CantidadDisponible: 0,  
      CodigoBarras: producto.CodigoBarras,
      ImagenURL: producto.imagenUrl
    };
  
    this.abrirModalAgregar(productoTransformado);
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