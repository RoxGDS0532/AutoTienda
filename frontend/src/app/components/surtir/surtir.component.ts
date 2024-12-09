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
import { ProductosRecomendadosService } from '../../services/productos-recomendados.service';
import { EstadoProducto } from '../../state-producto/producto.interface';
import { CategoryFilterPipe } from '../../category-filter.pipe'; // Asegúrate de importar tu pipe
import { ContextoProducto } from '../../state-producto/contexto';
import { SugerenciasService } from '../../services/sugerencias.service';
import { ProductosSurtirService, ProductoSurtir } from '../../services/productos-surtir.service';

@Component({
  selector: 'app-surtir',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule, FormsModule, CategoryFilterPipe],
  templateUrl: './surtir.component.html',
  styleUrl: './surtir.component.css'
})
export class SurtirComponent implements OnInit {
  productos: (Producto & { cantidadSolicitada: number; proveedorId: number | null })[] = [];
  proveedores: Proveedor[] = []; 
  categorias: any[] = []; 
  selectedCategoriaId: number = 0;
  productosFiltrados: (Producto & { cantidadSolicitada: number; proveedorId: number | null })[] = []; 
  productosSurtir: any[]= [];
  productosFiltradosSurtir: (ProductoSurtir & { cantidadSolicitada: number; proveedorId: number | null })[] = [];
  sugerencias: any[] = []; 
  contexto: ContextoProducto;

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService,
    private productosRecomendadosService: ProductosRecomendadosService,
    private sugerenciasService: SugerenciasService,
    private productosSurtirService: ProductosSurtirService,

  )
  {this.contexto = new ContextoProducto(
    new Disponible(this.productoService),
    this.productosRecomendadosService,
    this.proveedorService,
    this.productoService,
    this.categoriaService,
  );
}

  ngOnInit(): void {
    this.cargarProductos();
    this.cargarProveedores();
    this.cargarCategorias();
    this.cargarProductosSurtir();
  }

  valuarEstado(producto: Producto): void {
    this.contexto.verificarEstado(producto);
    let estado: EstadoProducto;
    if (this.contexto.estado instanceof Agotado) {
      estado = new Agotado(this.productosRecomendadosService);
    } else if (this.contexto.estado instanceof PorAgotarse) {
      estado = new PorAgotarse(this.proveedorService, this.sugerenciasService);
    } else {
      estado = new Disponible(this.productoService);
    }
  
    this.contexto.estado = estado;
    producto.estado = estado.constructor.name;
  }

  obtenerProveedorPorCategoria(categoriaId: number): Proveedor | undefined {
    return this.proveedores.find(proveedor => proveedor.Id === categoriaId);
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
  cargarProductosSurtir() {
    this.productosSurtirService.obtenerProductos().subscribe((productosSurtir) => {
      console.log('Productos a surtir obtenidos:', productosSurtir);
      this.productosSurtir = productosSurtir.map((productoSurtir) => {
        return productoSurtir;  
      });
    }, error => {
      console.error('Error al cargar productos a surtir', error); 
    });
  }

  eliminarProductoSurtir(producto: any): void {
    this.productosSurtirService.eliminarProducto(producto.id).subscribe({
      next: () => {
        this.productosSurtir = this.productosSurtir.filter(p => p.id !== producto.id);
        console.log(`Producto con ID ${producto.id} eliminado correctamente`);
      },
      error: (err) => {
        console.error('Error al eliminar el producto del servicio productosSurtir:', err);
      }
    });
  }

  


  solicitarProductos() {
    const solicitudes = this.productos
      .filter(producto => producto.cantidadSolicitada > 0)
      .map(producto => ({
        productoId: producto.Id, 
        proveedorId: producto.proveedorId,
        cantidad: producto.cantidadSolicitada
      }));

    console.log('Solicitudes a enviar:', solicitudes); 
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
