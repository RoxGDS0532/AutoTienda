import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// Modelo de Producto
export interface Producto {
  Id?: number;
  ImagenURL?: string;
  CodigoBarras: number;
  Nombre: string;
  CategoriaId: number; // Asegúrate de que esta propiedad exista aquí
  Precio: number;
  Cantidad: number;
  Stock: number;
  Imagen?: File; // Opcional
  CodigoQR?: string; // Opcional
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/producto';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/categoria'); 
  }

  // Crear un nuevo producto
  agregarProducto(producto: FormData): Observable<any> {
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
   obtenerProductoPorCodigoBarras(codigoBarras: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/codigo/${codigoBarras}`);
  }
}
