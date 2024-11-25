import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// Modelo de Producto
export interface Producto {
  Id?: number;
  Nombre: string;
  CategoriaId: number; 
  Precio: number;
  CantidadDisponible: number;  // Cantidad disponible en inventario
  CantidadEnCarrito?: number;  // Cantidad agregada al carrito
  ImagenURL?: string; 
  CodigoBarras?: string; 
  estado?: string; // Nombre del estado actual
  sugerencia?: string; // Recomendación basada en el estado

}



@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/producto';
  private solicitarUrl = 'http://localhost:3000/solicitar'; 


  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/categoria'); 
  }

  // Crear un nuevo producto
  agregarProducto(producto: Producto): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }

  // Actualizar un producto existente
  actualizarProducto(Id: number, Producto: Producto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${Id}`, Producto);
  }
  

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

   // Obtener un producto por su código de barras
   obtenerProductoPorCodigoBarras(codigoBarras: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/codigo/${codigoBarras}`);
  }

  solicitarProductos(solicitudes: any[]): Observable<any> { 
    return this.http.post(this.solicitarUrl, solicitudes);
  }
}
