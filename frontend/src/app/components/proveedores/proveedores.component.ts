import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ProveedorService } from '../../services/proveedor.service';
import { CategoriaService } from '../../services/categoria.service';
import { ToastrService } from 'ngx-toastr';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule],
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [ProveedorService, CategoriaService]
})
export class ProveedoresComponent implements OnInit {
  proveedores: any[] = [];
  proveedorSeleccionado: any = {};
  categorias: any[] = [];
  nuevaCategoria: string = '';
  modalProveedor: Modal | undefined;
  modalCategoria: Modal | undefined;

  constructor(
    private proveedorService: ProveedorService,
    private categoriaService: CategoriaService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.obtenerCategorias();
    this.listarProveedores();
    
  }

  listarProveedores() {
    this.proveedorService.listarProveedores().subscribe((proveedores: any[]) => {
      this.proveedores = proveedores.map(proveedor => {
        const categoria = this.categorias.find(categoria => categoria.Id === proveedor.CategoriaId);
        proveedor.CategoriaNombre = categoria ? categoria.Nombre : 'Sin categoría'; // Aquí se asigna el nombre de la categoría
        return proveedor;
      });
    });
  }
  

  guardarProveedor() {
    if (this.proveedorSeleccionado.id) {
      this.proveedorService.actualizarProveedor(this.proveedorSeleccionado.id, this.proveedorSeleccionado).subscribe(
        () => {
          this.toastr.success('Proveedor actualizado');
          this.listarProveedores();
          this.modalProveedor?.hide();
        },
        () => this.toastr.error('Error al actualizar proveedor')
      );
    } else {
      this.proveedorService.crearProveedor(this.proveedorSeleccionado).subscribe(
        () => {
          this.toastr.success('Proveedor creado');
          this.listarProveedores();
          this.modalProveedor?.hide();
        },
        () => this.toastr.error('Error al crear proveedor')
      );
    }
  }

  nuevoProveedor() {
    this.proveedorSeleccionado = {};
    this.modalProveedor = new Modal(document.getElementById('providerModal')!);
    this.modalProveedor.show();
  }

  editarProveedor(proveedor: any) {
    this.proveedorSeleccionado = { ...proveedor };
    this.modalProveedor = new Modal(document.getElementById('providerModal')!);
    this.modalProveedor.show();
  }


  eliminarProveedor(Id: number) {
    console.log("ID recibido para eliminar:", Id); // Depura aquí
    this.proveedorService.eliminarProveedor(Id).subscribe(
      response => {
        console.log('Proveedor eliminado', response);
        this.listarProveedores(); // Actualiza la lista de proveedores
      },
      error => {
        console.log('Error eliminando el proveedor', error);
      }
    );
  }
  

  cargarProveedor() {
    this.proveedorService.obtenerProveedor().subscribe({
      next: (proveedores) => {
        console.log('Proveedores obtenidos:', proveedores); // Verifica la estructura
        this.proveedores = proveedores; // Asegúrate de que los datos están correctos
      },
      error: (err) => {
        console.error('Error al cargar proveedores:', err);
      }
    });
  }
  
  obtenerCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(
      (data) => {
        this.categorias = data;
        this.listarProveedores(); // Llamamos a listarProveedores solo cuando las categorías estén cargadas
      },
      () => this.toastr.error('Error al obtener categorías')
    );
  }

  agregarCategoria() {
    if (this.nuevaCategoria.trim()) {
      this.categoriaService.crearCategoria({ Nombre: this.nuevaCategoria }).subscribe(
        () => {
          this.toastr.success('Categoría creada');
          this.obtenerCategorias();
          this.modalCategoria?.hide();
        },
        () => this.toastr.error('Error al crear categoría')
      );
    }
  }

  abrirModalCategoria() {
    this.nuevaCategoria = '';
    this.modalCategoria = new Modal(document.getElementById('categoryModal')!);
    this.modalCategoria.show();
  }
}
