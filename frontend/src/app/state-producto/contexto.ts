import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';
import { Agotado } from './agotado.estado';
import { Disponible } from './disponible.estado';
import { PorAgotarse } from './porAgotarse.estado';

export class ContextoProducto {
  private estado: EstadoProducto;

  constructor(estado: EstadoProducto) {
    this.estado = estado;
  }

  setEstado(estado: EstadoProducto): void {
    this.estado = estado;
  }

  verificarEstado(producto: Producto): void {
    if (producto.CantidadDisponible === 0) {
      this.estado = new Agotado(); 
    } else if (producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5) {
      this.estado = new PorAgotarse(); 
    } else {
      this.estado = new Disponible(); 
    }
  }
  

  solicitar(producto: Producto): void {
    this.estado.solicitar(producto);
  }

  sugerirAccion(): string {
    return this.estado.sugerirAccion();
  }

generateSugerencias(producto: Producto): any[] {
  // Función auxiliar para generar un número aleatorio entre min y max
  const randomInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  return [
    {
      productoId: producto.Id,
      productoNombre: producto.Nombre,
      proveedorId: 1, // Ejemplo: ID de proveedor
      cantidadPropuesta: randomInRange(10, 50),
      productoCategoriaId: producto.CategoriaId
    }
  ];
}






}