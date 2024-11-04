import { Component, OnInit } from '@angular/core';
import { ProductoService, Producto } from '../../services/producto.service'; 
import { CategoriaService, Categoria } from '../../services/categoria.service';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CategoryFilterPipe } from '../../category-filter.pipe';

import * as bootstrap from 'bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, CategoryFilterPipe],
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css'],
  providers: [ProductoService, CategoriaService, CategoryFilterPipe]
})

export class ProductoComponent implements OnInit {
  productos: Producto[] = [];
  categorias: Categoria[] = [];
  productoSeleccionado: Producto = { Id: 0, Nombre: '', Precio: 0, Cantidad: 0, Stock: 0, CategoriaId: 0 }; // Inicialización
  imagenFile: File | null = null; // Almacenar el archivo de imagen
  codigoQR: string = ''; // Almacenar el código QR
  productosFiltrados: Producto[] = []; // Lista de productos filtrados
  categoriaSeleccionada: number = 0; // ID de la categoría seleccionada
  busquedaProducto: string = '';

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private router:Router
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarCategorias();
  }

  cargarProductos() {
    this.productoService.obtenerProductos().subscribe(productos => {
      this.productos = productos;
      this.filtrarProductos(); // Filtrar productos al cargar
    });
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
    } else {
        console.error('El producto a editar no tiene un ID definido:', producto);
    }
}

agregarProducto() {
  if (this.imagenFile) {
    const formData = new FormData();
    formData.append('Imagen', this.imagenFile);
    formData.append('Nombre', this.productoSeleccionado.Nombre);
    formData.append('Precio', this.productoSeleccionado.Precio.toString());
    formData.append('Cantidad', this.productoSeleccionado.Cantidad.toString());
    formData.append('Stock', this.productoSeleccionado.Stock.toString());
    formData.append('CategoriaId', this.productoSeleccionado.CategoriaId.toString());
    formData.append('CodigoQR', this.codigoQR); // Si es opcional
    this.productoService.agregarProducto(formData).subscribe(() => {
      this.cargarProductos();
      alert('Producto agregado correctamente');
    }, (error) => {
      alert('Error al agregar el producto');
      console.error(error); // Añade esto para depurar
    });
  }
}


actualizarProducto() {
  if (this.productoSeleccionado.Id !== undefined) {
    // Crear el objeto con los datos del producto
    const productoData = {
      Nombre: this.productoSeleccionado.Nombre,
      Precio: this.productoSeleccionado.Precio,
      Cantidad: this.productoSeleccionado.Cantidad,
      Stock: this.productoSeleccionado.Stock,
      CategoriaId: this.productoSeleccionado.CategoriaId
    };

    this.productoService.actualizarProducto(this.productoSeleccionado.Id, productoData).subscribe(
      () => {
        this.cargarProductos();
        alert('Producto editado correctamente');
      },
      (error) => {
        alert('Error al editar el producto');
        console.error(error); // Para depuración
      }
    );
  } else {
    console.error('El ID del producto no está definido.');
  }
}



  eliminarProducto(id: number) {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        this.productoService.eliminarProducto(id).subscribe(
            response => {
                alert('Producto eliminado correctamente.');
                this.cargarProductos(); // Recargar la lista de productos
            },
            error => {
                console.error('Error al eliminar el producto:', error);
                alert('Hubo un error al eliminar el producto.'); // Mensaje de error
            }
        );
    }
}

  limpiarFormulario() {
    this.productoSeleccionado = { Id: 0, Nombre: '', Precio: 0, Cantidad: 0, Stock: 0, CategoriaId: 0 };
    this.imagenFile = null; // Reiniciar la imagen
    this.codigoQR = ''; // Reiniciar el código QR
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      this.imagenFile = input.files[0]; // Guardar el archivo de imagen
    }
  }

  setDefaultImage(event: any) {
    event.target.src = 'assets/default.jpg';
  }

  onCategoriaChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Casting al tipo correcto
    this.categoriaSeleccionada = Number(selectElement.value); // Asegúrate de convertir el valor a número
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
  
