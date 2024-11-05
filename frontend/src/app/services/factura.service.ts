import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
interface Producto {
  nombre: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

interface FacturaData {
  fecha: Date;
  clienteCorreo: string;
  productos: Producto[];
  subtotal: number;
  descuento: number;
  total: number;
}

@Injectable({
  providedIn: 'root'
})

export class FacturaService {

  private apiUrl = 'http://localhost:3000/generar-factura'; // URL del endpoint en tu backend

  constructor(private http: HttpClient) {}

  generarFactura(facturaData: any): Observable<Blob> {
    return this.http.post(this.apiUrl, facturaData, { responseType: 'blob' });
  }
}
