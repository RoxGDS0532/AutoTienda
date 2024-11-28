import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface ProductoRecomendado {
  id?: number;
  nombre: string;
  categoria_id: number; 
  precio: number;
  imagenUrl?: string; 
  CodigoBarras?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ProductosRecomendadosService {

  private apiUrl = 'http://localhost:3000/productoRecomendado';

  constructor(private http: HttpClient) { }

  obtenerProductos(): Observable<ProductoRecomendado[]> {
    return this.http.get<ProductoRecomendado[]>(this.apiUrl);
  }

  obtenerProductosRecomendadosPorCategoria(categoriaId: number): Observable<ProductoRecomendado[]> {
    return this.http.get<ProductoRecomendado[]>(`${this.apiUrl}?categoriaId=${categoriaId}`);
  }

  obtenerProductoPorId(id: number): Observable<ProductoRecomendado> {
    return this.http.get<ProductoRecomendado>(`${this.apiUrl}/${id}`);
  }
  
    // Crear un nuevo producto
    agregarProducto(producto: ProductoRecomendado): Observable<any> {
      return this.http.post(this.apiUrl, producto);
    }
  
    // Actualizar un producto existente
    actualizarProducto(Id: number, Producto: ProductoRecomendado): Observable<any> {
      return this.http.put(`${this.apiUrl}/${Id}`, Producto);
    }
    // Eliminar un producto
    eliminarProducto(id: number): Observable<any> {
      return this.http.delete(`${this.apiUrl}/${id}`);
    }
  
}
