import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:3000/proveedor';

  constructor(private http: HttpClient) {}

  // Obtener todos los proveedores
  public listarProveedores(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un nuevo proveedor
  public crearProveedor(proveedor: any): Observable<any> {
    return this.http.post(this.apiUrl, proveedor);
  }

  // Actualizar un proveedor existente
  actualizarProveedor(Id: number, proveedor: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${Id}`, proveedor);
  }  

  // Eliminar un proveedor
  public eliminarProveedor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener un proveedor específico
  public obtenerProveedor(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
