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

  
  generarSugerencia(producto: Producto): void {
    const nuevaSugerencia = this.sugerenciasService.generateSugerencias(producto);
    if (nuevaSugerencia) {
      this.sugerencias = [nuevaSugerencia];
      this.mostrarSugerencias = true;
    } else {
      this.mostrarSugerencias = false;
      console.error('No se pudo generar una sugerencia');
    }
  }

  aceptarSugerencia(sugerencia: any): void {
    console.log('Sugerencia aceptada:', sugerencia);
    this.mostrarSugerencias = false;
    this.sugerencias = []; // Limpiar sugerencias
  }

  rechazarSugerencia(sugerencia: any): void {
    const index = this.sugerencias.findIndex((s: any) => s === sugerencia);

    if (index > -1) {
      this.sugerencias.splice(index, 1);
    }
  
    if (this.sugerencias.length === 0) {
      const nuevaSugerencia = this.sugerenciasService.generarMultiplesSugerencias({
        Id: sugerencia.productoId,
        Nombre: sugerencia.productoNombre,
        CategoriaId: sugerencia.productoCategoriaId,
        Precio: 0,
        CantidadDisponible: 0,
        CodigoBarras: '',
      });
  
      this.sugerencias = nuevaSugerencia;
      this.mostrarSugerencias = this.sugerencias.length > 0;
    }
  }
  
}