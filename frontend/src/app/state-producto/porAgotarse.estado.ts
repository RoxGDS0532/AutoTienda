import { EstadoProducto } from './producto.interface';
import { Producto } from '../services/producto.service';
import { SugerenciasService } from '../services/sugerencias.service';
import { ProveedorService, Proveedor } from '../services/proveedor.service';

export class PorAgotarse implements EstadoProducto {
  private mostrarSugerencias = false;
  private proveedores: Proveedor[] = []; 
  private producto: Producto | null = null; 
  private sugerencias: any | null = null; 
  constructor( private proveedorService: ProveedorService,private sugerenciasService: SugerenciasService,) {}


  sugerirAccion(): string {
    if (!this.producto) {
      return 'No se ha establecido un producto.';
    }
  
    // Mensaje cuando no hay proveedores disponibles
    if (this.proveedores.length === 0) {
      return `El producto "${this.producto.Nombre}" está en punto de agotarse. Sugerencia: Reabastecer pronto. Buscando proveedores...`;
    }
  
    // Listar nombres de los proveedores
    const nombresProveedores = this.proveedores.map(proveedor => proveedor.NombreProveedor).join(', ');
    return `El producto "${this.producto.Nombre}" está en punto de agotarse. Sugerencia: Reabastecer pronto con los siguientes proveedores: ${nombresProveedores}`;
  }
  

  verificarEstado(producto: Producto): boolean {
    console.log(`El producto "${producto.Nombre}" está en punto de agotarse.`);
    return producto.CantidadDisponible > 0 && producto.CantidadDisponible <= 5;
  }

  



  
}