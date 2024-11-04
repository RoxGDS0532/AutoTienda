import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  private apiUrl = 'http://localhost:3000/usuario';

  constructor(private http: HttpClient) {}

  // Obtener todos los usuario
  public listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear un nuevo usuario
  public crearUsuario(usuario: any): Observable<any> {
    return this.http.post(this.apiUrl, usuario);
  }

  // Actualizar un usuario existente
  actualizarUsuario(Id: number, usuario: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${Id}`, usuario);
  }  

  // Eliminar un usuario
  public eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener un usuario específico
  public obtenerUsuario(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  public resetPassword(correo: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, { correo })
      .pipe(catchError((error) => throwError(error)));
  }
}
