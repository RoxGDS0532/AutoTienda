import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from './producto.service';

export interface ProductoSurtir {
  id?: number;
  CodigoBarras?: string; 
  nombre: string;
  categoria_id: number; 
  id_proveedor?:number;
  cantidadSolicitada?: number;
  precio: number;
  imagenUrl?: string; 
}
@Injectable({
  providedIn: 'root'
})
export class ProductosSurtirService {
  private apiUrl = 'http://localhost:3000/productosSurtir';

  constructor(private http: HttpClient) { }

  obtenerProductos(): Observable<ProductoSurtir[]> {
    return this.http.get<ProductoSurtir[]>(this.apiUrl);
  }


  obtenerProductoPorId(id: number): Observable<ProductoSurtir> {
    return this.http.get<ProductoSurtir>(`${this.apiUrl}/${id}`);
  }
  
  // Crear un nuevo producto
  agregarProducto(producto: ProductoSurtir): Observable<any> {
    return this.http.post(this.apiUrl, producto);
  }
  
  // Actualizar un producto existente
  actualizarProducto(Id: number, Producto: ProductoSurtir): Observable<any> {
    return this.http.put(`${this.apiUrl}/${Id}`, Producto);
  }
  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
