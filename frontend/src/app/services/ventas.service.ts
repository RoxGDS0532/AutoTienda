import { Injectable } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface DetalleVenta {
  id_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export interface Venta {
  fecha_venta: Date;
  hora_venta: Date;
  pago_total: number;
  tipo_pago: string;
  detalles: DetalleVenta[];
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  private apiUrl = 'http://localhost:3000/ventas';
  constructor(private http:HttpClient) {}

  registrarVenta(venta: Venta): Observable<any> {
    return this.http.post<any>(this.apiUrl, venta);
  }
}
