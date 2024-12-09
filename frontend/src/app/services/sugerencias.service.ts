import { Injectable } from '@angular/core';
import { ProductoService, Producto } from '../services/producto.service'; 
import { ProveedorService, Proveedor } from '../services/proveedor.service';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SugerenciasService {
  productos: (Producto & { cantidadSolicitada: number; proveedorId: number | null })[] = [];
  proveedores: Proveedor[] = []; // Lista de proveedores
  selectedCategoriaId: number = 0;
  sugerencias: any[] = []; // Almacena las sugerencias generadas para productos

  constructor(
    private productoService: ProductoService,
    private proveedorService: ProveedorService
  ) {
    // Obtener proveedores al iniciar el servicio
    this.obtenerProveedores();
  }

  // Método para obtener los proveedores de la categoría del producto
  obtenerProveedorPorCategoria(categoriaId: number): Proveedor | undefined {
    return this.proveedores.find(proveedor => proveedor.CategoriaId === categoriaId);
  }

  eliminarSugerencia(productoId: number): Observable<void> {
    const index = this.sugerencias.findIndex(s => s.productoId === productoId);
    if (index !== -1) {
      this.sugerencias.splice(index, 1); // Eliminar la sugerencia localmente
      console.log(`Sugerencia con ID ${productoId} eliminada.`);
    }
    return of(); // Simula una respuesta exitosa
  }

  // Obtener la lista de proveedores
  private obtenerProveedores(): void {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  generateSugerencias(producto: Producto): any | null {
    const proveedor = this.obtenerProveedorPorCategoria(producto.CategoriaId);
    if (proveedor) {
      const cantidadPropuesta = this.randomInRange(10, 80);
      return {
        productoId: producto.Id,
        productoNombre: producto.Nombre,
        proveedorNombreProveedor: proveedor.NombreProveedor,
        proveedorId: proveedor.Id,
        proveedorNombre: proveedor.Nombre,
        cantidadPropuesta: cantidadPropuesta,
        productoCategoriaId: producto.CategoriaId,
      };
    } else {
      console.error(`No hay proveedores disponibles para la categoría del producto: ${producto.Nombre}`);
      return null;
    }
  }

  

  generarMultiplesSugerencias(producto: Producto): any[] {
    const sugerencias: any[] = [];
    const proveedoresCategoria = this.proveedores.filter(
      (proveedor) => proveedor.CategoriaId === producto.CategoriaId
    );
  
    proveedoresCategoria.forEach((proveedor) => {
      const cantidadPropuesta = this.randomInRange(10, 80);
      sugerencias.push({
        productoId: producto.Id,
        productoNombre: producto.Nombre,
        proveedorNombreProveedor: proveedor.NombreProveedor,
        proveedorId: proveedor.Id,
        proveedorNombre: proveedor.Nombre,
        cantidadPropuesta: cantidadPropuesta,
        productoCategoriaId: producto.CategoriaId,
      });
    });
  
    return sugerencias;
  }
  
  // Función para generar un número aleatorio dentro de un rango
  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
