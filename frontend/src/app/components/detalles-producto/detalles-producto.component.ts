import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../../services/producto.service';
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
  productosDelProveedor: { [proveedorId: number]: ProductoRecomendado[] } = {};
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
    private porAgotarse: PorAgotarse,
    private productosRecomendadosService: ProductosRecomendadosService,
  ) {
    this.contexto = new ContextoProducto(
      new Disponible(),
      this.productosRecomendadosService,
      this.proveedorService,
      this.categoriaService
    );
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
  }

  obtenerProducto(id: number): void {
    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (producto) => {
        console.log('Producto obtenido:', producto);
        this.producto = producto;
        this.actualizarEstado(this.producto);
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

  actualizarEstado(producto: Producto | null): void {
    if (producto !== null) {
      this.contexto.verificarEstado(producto);
  
      if (this.contexto['estado'] instanceof Agotado) {
        const estadoAgotado = this.contexto['estado'] as Agotado;
        estadoAgotado.setProducto(producto);
        estadoAgotado.cargarProductosRecomendados().subscribe(
          productosPorProveedor => {
            // Ahora 'productosPorProveedor' es un objeto con la estructura { proveedorId: Producto[] }
            this.productosRecomendados = []; // Reinicia la lista de productos recomendados
            // Iteramos sobre los proveedores y sus productos
            for (const proveedorId in productosPorProveedor) {
              const productosDelProveedor = productosPorProveedor[proveedorId];
              console.log(`Productos recomendados del proveedor ${proveedorId}:`, productosDelProveedor);
              
              // Puedes agregar los productos recomendados por proveedor a la lista general
              this.productosRecomendados.push(...productosDelProveedor);
            }
            this.sugerencia = estadoAgotado.sugerirAccion();
            this.mostrarRecomendaciones = true;
          },
          error => {
            console.error('Error al cargar productos recomendados:', error);
          }
        );
      } else if (this.contexto['estado'] instanceof PorAgotarse) {
        const estadoPorAgotarse = this.contexto['estado'] as PorAgotarse;
        estadoPorAgotarse.generarSugerencia(producto);
        this.sugerencia = estadoPorAgotarse.sugerirAccion();
        this.mostrarSugerencias = true;
      } else {
        this.sugerencia = this.contexto.sugerirAccion();
      }
    } else {
      console.error('Producto es null');
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
    this.porAgotarse.aceptarSugerencia(sugerencia);
    console.log('Sugerencia aceptada:', sugerencia);
  }

  rechazarSugerencia(sugerencia: any): void {
    this.porAgotarse.rechazarSugerencia(sugerencia);
    console.log('Sugerencia rechazada:', sugerencia);
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