import { Component, OnInit } from '@angular/core';
import { ProveedorService } from '../../services/proveedor.service';
import { Modal } from 'bootstrap';
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
  proveedores: any[] = [];
  proveedorSeleccionado: any = {};

  constructor(private proveedorService: ProveedorService) {
    this.listarProveedores();
  }

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

  guardarProveedor() {
    if (this.proveedorSeleccionado && this.proveedorSeleccionado.Id) {
      // Si el proveedor tiene un ID, se trata de una actualización
      this.proveedorService.actualizarProveedor(this.proveedorSeleccionado.Id, this.proveedorSeleccionado)
        .subscribe(
          response => {
            console.log('Proveedor actualizado:', response);
            this.listarProveedores(); // Actualiza la lista de proveedores
          },
          error => {
            console.error('Error al actualizar el proveedor', error);
          }
        );
    } else {
      // Si no hay un ID, se trata de una creación
      this.proveedorService.crearProveedor(this.proveedorSeleccionado)
        .subscribe(
          response => {
            console.log('Proveedor creado:', response);
            this.listarProveedores();
          },
          error => {
            console.error('Error al crear proveedor', error);
          }
        );
    }
  }
  
  
  nuevoProveedor() {
    this.proveedorSeleccionado = {};
  }

  editarProveedor(proveedor: any) {
    this.proveedorSeleccionado = { ...proveedor };
  }

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
