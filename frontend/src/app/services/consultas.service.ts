import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

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
export class ConsultasService {
  private apiUrlV = 'http://localhost:3000/consulta/venta';
  private apiUrlP = 'http://localhost:3000/consulta/pago';
  private apiUrlR = 'http://localhost:3000/consulta/deVenta';
  private apiUrlVID = 'http://localhost:3000/consulta/getVentaById';
  private apiUrlPID = 'http://localhost:3000/consulta/getPagoById';
  private apiUrlDVID = 'http://localhost:3000/consulta/getDeVentaById';
  private apiUrl = 'http://localhost:3000/consulta/producto';

  constructor(private http: HttpClient) {}

// Obtener todos los productos
public listarproducto(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl).pipe(
    catchError((error) => {
      console.error('Error al listar ventas:', error);
      return throwError(() => new Error('Error al listar ventas'));
    })
  );
}

public obtenerproducto(id: number): Observable<any> {
  return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
    catchError((error) => {
      console.error(`Error al obtener venta con ID ${id}:`, error);
      return throwError(() => new Error('Error al obtener la venta'));
    })
  );
}

  public listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlV).pipe(
      catchError((error) => {
        console.error('Error al listar ventas:', error);
        return throwError(() => new Error('Error al listar ventas'));
      })
    );
  }

  public obtenerVenta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlVID}/${id}`).pipe(
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
    return this.http.get<any>(`${this.apiUrlPID}/${id}`).pipe(
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
    return this.http.get<any>(`${this.apiUrlDVID}/${id}`).pipe(
      catchError((error) => {
        console.error(`Error al obtener recibo con ID ${id}:`, error);
        return throwError(() => new Error('Error al obtener el recibo'));
      })
    );
  }

  
}
