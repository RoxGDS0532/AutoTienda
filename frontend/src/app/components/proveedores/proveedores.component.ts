import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';// Asegúrate de que la ruta sea correcta
import { Modal } from 'bootstrap'; // Importa Modal desde bootstrap
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule], 
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [ProveedorService]
})
export class ProveedoresComponent {
  proveedores: any[] = []; // Lista de proveedores
  proveedorSeleccionado: any = {}; // Inicializa el proveedor seleccionado

  constructor(private proveedorService: ProveedorService) {
    this.listarProveedores();
  }

  // Método para listar proveedores
  listarProveedores() {
    this.proveedorService.listarProveedores().subscribe(
      (data) => {
        this.proveedores = data;
      },
      (error) => {
        console.error('Error al listar proveedores', error);
      }
    );
  }

  // Método para guardar proveedor
  guardarProveedor() {
    if (this.proveedorSeleccionado.id) {
      // Actualizar proveedor existente
      this.proveedorService.actualizarProveedor(this.proveedorSeleccionado.id, this.proveedorSeleccionado).subscribe(
        () => {
          this.listarProveedores();
          this.proveedorSeleccionado = {}; // Reiniciar el objeto después de guardar
        },
        (error) => {
          console.error('Error al actualizar proveedor', error);
        }
      );
    } else {
      // Crear nuevo proveedor
      this.proveedorService.crearProveedor(this.proveedorSeleccionado).subscribe(
        () => {
          this.listarProveedores();
          this.proveedorSeleccionado = {}; // Reiniciar el objeto después de guardar
        },
        (error) => {
          console.error('Error al crear proveedor', error);
        }
      );
    }
  }

  // Método para seleccionar un nuevo proveedor
  nuevoProveedor() {
    this.proveedorSeleccionado = {}; // Reiniciar el objeto para agregar nuevo proveedor
  }

  // Método para editar un proveedor
  editarProveedor(proveedor: any) {
    this.proveedorSeleccionado = { ...proveedor }; // Clonar el proveedor para editar
  }

  // Método para eliminar un proveedor
  eliminarProveedor(id: number) {
    this.proveedorService.eliminarProveedor(id).subscribe(
      () => {
        this.listarProveedores();
      },
      (error) => {
        console.error('Error al eliminar proveedor', error);
      }
    );
  }
}
