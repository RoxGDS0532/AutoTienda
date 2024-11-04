import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs'; 
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/usuario'; 
  constructor(private http: HttpClient) {}

  login(Correo: string, Contrasena: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { Correo, Contrasena }).pipe(
        catchError(err => {
            // Manejar el error
            console.error('Error en el inicio de sesión', err);
            return throwError(err);
        })
    );
}

}
