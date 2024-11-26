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
  productosSimilares: ProductoSimilar[] = [];  
  producto: Producto | null = null;
  productoR: Producto = { Id: 0, Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0, CodigoBarras: '', ImagenURL: '' };
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = []; 
  productosRecomendados = [
    { CodigoBarras: '7589654710005',Nombre: 'Sabritas', CategoriaId: '1', Precio: 25.00, CantidadDisponible:10, ImagenURL: 'https://i5.walmartimages.com.mx/gr/images/product-images/img_large/00750101116765L.jpg' },
    { CodigoBarras: '7288554700004',Nombre: 'Coca Cola', CategoriaId: '1', Precio: 18.00,CantidadDisponible:15 ,ImagenURL: 'https://www.coca-cola.com/content/dam/onexp/co/es/brands/coca-cola/coca-cola-original/ccso_600ml_750x750.png' }
  ];

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

  actualizarEstado(producto: Producto): void {
    this.contexto.verificarEstado(producto);
    if (this.contexto['estado'] instanceof Agotado) {
      this.sugerencia = this.contexto.sugerirAccion();
      this.mostrarRecomendaciones = this.contexto['estado'] instanceof Agotado;
    } else if (this.contexto['estado'] instanceof PorAgotarse) {
      this.sugerencias = this.sugerenciasService.generateSugerencias(producto);
      this.mostrarSugerencias = true;
    }
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

  getCategoriaNombre(categoriaId: number): string {
    const categoria = this.categorias.find(cat => cat.Id === categoriaId);
    return categoria ? categoria.Nombre : 'Sin categoría';
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