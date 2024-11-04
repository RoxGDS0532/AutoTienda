import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


// Modelo de Producto
export interface Producto {
  Id?: number;
  CodigoBarras: number;
  ImagenURL?: string;
  Nombre: string;
  Categoria: string;
  Precio: number;
  Cantidad: number;
  Stock:number;
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
   obtenerProductoPorCodigoBarras(codigoBarras: number): Observable<Producto> {
    return this.http.get<Producto>(`${this.apiUrl}/codigo/${codigoBarras}`);
  }
}
