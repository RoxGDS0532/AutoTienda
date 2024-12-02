import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service'; 
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CategoryFilterPipe } from '../../category-filter.pipe';
import { Agotado } from '../../state-producto/agotado.estado';
import { PorAgotarse } from '../../state-producto/porAgotarse.estado';
import { Disponible } from '../../state-producto/disponible.estado';
import { ContextoProducto } from '../../state-producto/contexto';
import { EstadoProducto } from '../../state-producto/producto.interface';
import { ProveedorService } from '../../services/proveedor.service';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';
import { ProductosRecomendadosService } from '../../services/productos-recomendados.service';
import { SugerenciasService } from '../../services/sugerencias.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [ProductoService, CategoriaService, CategoryFilterPipe,ProveedorService]
})

export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productoSeleccionado: Producto = { Id: 0, ImagenURL:'', Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0 , CodigoBarras:''}; // Inicialización
  imagenFile: File | null = null; 
  productosFiltrados: Producto[] = []; 
  categoriaSeleccionada: number = 0; 
  busquedaProducto: string = '';
  productosAgotados: Producto[] = [];
  productosPorAgotarse: Producto[] = [];
  productosDisponibles: Producto[] = [];
  contexto: ContextoProducto;
  

verDetalleProducto(id: number | undefined): void {
  if (id !== undefined) {
    this.router.navigate(['/detalle-producto', id]);
  } else {
    console.error('El producto no tiene un ID válido.');
  }
}

constructor(
  private categoriaService: CategoriaService,
  private toastr: ToastrService,
  private router: Router,
  private proveedorService: ProveedorService,
  private productosRecomendadosService: ProductosRecomendadosService,
  private sugerenciasService: SugerenciasService,
  private productoService: ProductoService,
) { 
  this.contexto = new ContextoProducto(
    new Disponible(this.productoService),
    this.productosRecomendadosService,
    this.proveedorService,
    this.productoService,
    this.categoriaService,
  );
}


  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  evaluarEstado(producto: Producto): void {
    if (producto.CantidadDisponible === 0) {
      this.contexto.setEstado(new Agotado(this.productosRecomendadosService));
    } else if (producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5) {
      this.contexto.setEstado(new PorAgotarse(this.proveedorService, this.sugerenciasService));
    } else {
      this.contexto.setEstado(new Disponible(this.productoService));
    }
    this.contexto.verificarEstado(producto);
    producto.estado = this.contexto['estado'].constructor.name;
    //producto.sugerencia = this.contexto.sugerirAccion(producto);
  }
  

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe((productos) => {
      console.log('Productos obtenidos:', productos);
      this.productos = productos.map((producto) => {
        this.evaluarEstado(producto);
        return producto;
      });
      this.clasificarProductosPorEstado();
      this.filtrarProductos();
    });
  }
  
  clasificarProductosPorEstado() {
    this.productosAgotados = this.productos.filter(p => p.estado === 'Agotado');
    this.productosPorAgotarse = this.productos.filter(p => p.estado === 'PorAgotarse');
    this.productosDisponibles = this.productos.filter(p => p.estado === 'Disponible');
  }
  


  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(categorias => this.categorias = categorias);
  }
  getCategoriaNombre(categoriaId: number): string {
    const categoria = this.categorias.find(cat => cat.Id === categoriaId);
    return categoria ? categoria.Nombre : 'Sin categoría';
}


  abrirModalAgregar() {
    this.limpiarFormulario();
    const agregarModal = new bootstrap.Modal(document.getElementById('agregarProductoModal')!);
    agregarModal.show();
  }

  editarProducto(producto: Producto) {
    if (producto && producto.Id) {
        this.productoSeleccionado = { ...producto }; // Clonar el producto para editar
        const editarModal = new bootstrap.Modal(document.getElementById('editarProductoModal')!);
        editarModal.show();
        this.toastr.success('Producto editado correctamente.', '¡Éxito!');
    } else {
        console.error('El producto a editar no tiene un ID definido:', producto);
        this.toastr.error('Hubo un error al editar el producto.', '¡Error!');
    }
}

agregarProducto() {
  console.log('Producto a agregar:', this.productoSeleccionado); // Para verificar
  this.productoService.agregarProducto(this.productoSeleccionado).subscribe(() => {
    this.cargarProductos();
    const agregarModal = bootstrap.Modal.getInstance(document.getElementById('agregarProductoModal')!);
    agregarModal?.hide();
    this.toastr.success('Producto agregado correctamente.', '¡Éxito!');
  }, error => {
    console.error('Error al agregar el producto:', error);
    this.toastr.error('Hubo un error al agregar el producto.', '¡Error!');
  });
}

actualizarProducto() {
  const Id = this.productoSeleccionado.Id; // Assuming productoSeleccionado has an Id property

  if (Id ) { 
    this.productoService.actualizarProducto(Id, this.productoSeleccionado).subscribe(() => {
      this.cargarProductos(); 
      const editarModal = bootstrap.Modal.getInstance(document.getElementById('editarProductoModal')!);
      editarModal?.hide(); 
      this.toastr.success('Producto actualizado correctamente.', '¡Éxito!');
    }, error => {
      console.error('Error updating product:', error);
      this.toastr.error('Hubo un error al actualizar el producto.', '¡Error!');
    });
  } else {
    console.error('Invalid product ID or image URL.');
    
  }
}



  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        this.productoService.eliminarProducto(id).subscribe(
            response => {
                alert('Producto eliminado correctamente.');
                this.cargarProductos(); // Recargar la lista de productos
                this.toastr.success('Producto eliminado correctamente.', '¡Éxito!');
            },
            error => {
                console.error('Error al eliminar el producto:', error);
                this.toastr.error('Hubo un error al eliminar el producto.', '¡Error!');
            }
        );
    }
}

  limpiarFormulario() {
    this.productoSeleccionado = { Id: 0, ImagenURL:'', Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0, CodigoBarras:'' };
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imagenFile = input.files[0]; 
    }
  }
  setDefaultImage(event: any) {
    const element = event.target as HTMLImageElement;
    event.target.src = 'assets/default.jpg';
  }

  onCategoriaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Casting al tipo correcto
    this.categoriaSeleccionada = Number(selectElement.value); 
    this.filtrarProductos(); // Filtra los productos cada vez que se cambia de categoría
}

  onBusquedaChange(event: Event) {
    const input = event.target as HTMLInputElement; // Casting
    if (input) { // Comprobación de null
      this.busquedaProducto = input.value; // Accede a la propiedad value
      this.filtrarProductos(); // Filtra al cambiar la búsqueda
    }
  }
  

  filtrarProductos() {
    this.productosFiltrados = this.productos.filter(producto => {
      const coincideCategoria = this.categoriaSeleccionada === 0 || producto.CategoriaId === this.categoriaSeleccionada;
      const coincideBusqueda = producto.Nombre.toLowerCase().includes(this.busquedaProducto.toLowerCase());
      return coincideCategoria && coincideBusqueda;
    });
    console.log('Productos filtrados:', this.productosFiltrados);
  }
  irASurtirProductos(): void {
    this.router.navigate(['/surtir']);
  }

}