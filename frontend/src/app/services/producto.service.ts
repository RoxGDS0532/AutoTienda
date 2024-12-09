import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';


// Modelo de Producto
export interface Producto {
  Id?: number;
  Nombre: string;
  CategoriaId: number; 
  Precio: number;
  CantidadDisponible: number;
  CantidadEnCarrito?: number;
  ImagenURL?: string; 
  CodigoBarras?: string; 
  sugerencia?: string; 
  PrecioConDescuento?: number;
  estado?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  private apiUrl = 'http://localhost:3000/producto';
  private solicitarUrl = 'http://localhost:3000/solicitar'; 
  private emailApiUrl = 'http://localhost:3000/producto/enviar';

  constructor(private http: HttpClient) {}

  // Obtener todos los productos
  obtenerProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.apiUrl);
  }
  obtenerCategorias(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:3000/categoria'); 
  }
  // Obtener un producto por su ID
  obtenerProductoPorId(id: number): Observable<Producto> {
  return this.http.get<Producto>(`${this.apiUrl}/${id}`);
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

  obtenerProductosPromocion(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/promocion`);
  }

  enviarCorreoProveedor(pedido: any, proveedorCorreo: string): Observable<any> {
    const payload = {
      producto: {
        nombre: pedido.nombre,
        cantidad: pedido.cantidad,
        categoria: pedido.categoria,
        codigoBarras: pedido.codigoBarras,
        precio: pedido.precio
      },
      proveedorCorreo: proveedorCorreo
    };
    console.log("Enviando detalles al backend:", payload);
    return this.http.post<any>(this.emailApiUrl, payload);
  }
  
}
