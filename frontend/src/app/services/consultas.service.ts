import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConsultasService {
  private apiUrlV = 'http://localhost:3000/consulta/venta';
  private apiUrlP = 'http://localhost:3000/consulta/pago';
  private apiUrlR = 'http://localhost:3000/consulta/recibo';

  constructor(private http: HttpClient) {}

  public listarVentas(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlV);
  }

  public obtenerVenta(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlV}/${id}`);
  }

 public listarPagos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlP);
  }

  public obtenerpago(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlP}/${id}`);
  }

  public listarRecibos(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrlR);
  }

  public obtenerRecibo(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrlR}/${id}`);
  }
}
