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
    this.listarProveedores();
    this.obtenerCategorias();
  }

  listarProveedores() {
    this.proveedorService.listarProveedores().subscribe((proveedores: any[]) => {
      this.proveedores = proveedores.map(proveedor => {
        // Busca la categoría correspondiente al CategoriaId del proveedor
        const categoria = this.categorias.find(categoria => categoria.Id === proveedor.CategoriaId);
        // Asigna el nombre de la categoría al proveedor
        proveedor.CategoriaNombre = categoria ? categoria.Nombre : 'Sin categoría';
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

  eliminarProveedor(id: number) {
    this.proveedorService.eliminarProveedor(id).subscribe(
      () => {
        this.toastr.success('Proveedor eliminado');
        this.listarProveedores();
      },
      () => this.toastr.error('Error al eliminar proveedor')
      
    );
  }

  obtenerCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(
      (data) => (this.categorias = data),
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
