import { Injectable } from '@angular/core';
import { ProductoService, Producto } from '../services/producto.service'; 
import { ProveedorService, Proveedor } from '../services/proveedor.service';


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

  // Obtener la lista de proveedores
  private obtenerProveedores(): void {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  // Generar sugerencias de productos basadas en la disponibilidad de proveedores
  generateSugerencias(producto: Producto): any | null {
    // Encontrar un proveedor adecuado para la categoría del producto
    const proveedor = this.obtenerProveedorPorCategoria(producto.CategoriaId);
  
    if (proveedor) {
      // Generar nueva sugerencia
      const cantidadPropuesta = this.randomInRange(10, 50);
      const sugerencia = {
        productoId: producto.Id,
        productoNombre: producto.Nombre,
        proveedorId: proveedor.Id,
        cantidadPropuesta: cantidadPropuesta,
        productoCategoriaId: producto.CategoriaId,
      };
      return sugerencia;
    } else {
      console.error(
        `No hay proveedores disponibles para la categoría del producto: ${producto.Nombre}`
      );
      return null; // Indica que no hay sugerencias válidas
    }
  }
  
  // Función para generar un número aleatorio dentro de un rango
  private randomInRange(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
