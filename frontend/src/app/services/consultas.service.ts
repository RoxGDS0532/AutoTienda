import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private apiUrlV = 'http://localhost:3000/consulta/venta';
  private apiUrlP = 'http://localhost:3000/consulta/pago';
  private apiUrlR = 'http://localhost:3000/consulta/recibo';

  constructor(private http: HttpClient) {}

  public listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlV).pipe(
      catchError((error) => {
        console.error('Error al listar ventas:', error);
        return throwError(() => new Error('Error al listar ventas'));
      })
    );
  }

  public obtenerVenta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlV}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al obtener venta con ID ${id}:`, error);
        return throwError(() => new Error('Error al obtener la venta'));
      })
    );
  }

  public listarPagos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlP).pipe(
      catchError((error) => {
        console.error('Error al listar pagos:', error);
        return throwError(() => new Error('Error al listar pagos'));
      })
    );
  }

  public obtenerPago(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlP}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al obtener pago con ID ${id}:`, error);
        return throwError(() => new Error('Error al obtener el pago'));
      })
    );
  }

  public listarRecibos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlR).pipe(
      catchError((error) => {
        console.error('Error al listar recibos:', error);
        return throwError(() => new Error('Error al listar recibos'));
      })
    );
  }

  public obtenerRecibo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlR}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al obtener recibo con ID ${id}:`, error);
        return throwError(() => new Error('Error al obtener el recibo'));
      })
    );
  }
}
