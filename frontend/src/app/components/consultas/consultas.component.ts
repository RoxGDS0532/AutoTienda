import { Component, OnInit } from '@angular/core';
import { ConsultasService } from '../../services/consultas.service';
import { ChartConfiguration } from 'chart.js';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';

interface Venta {
  fecha_venta: string;
  hora_venta: string;
  pago_total: number;
  tipo_pago: string;
  detalle_venta: string;
}

@Component({
  selector: 'app-consultas',
  standalone: true,
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  imports: [CommonModule, FormsModule, NgChartsModule],
  providers: [DatePipe]
})
export class ConsultasComponent implements OnInit {
  ventasData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  productosVendidosData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  horarioVentasData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  ticketUsoData: ChartConfiguration['data'] = { labels: [], datasets: [] };

  selectedFilter: string = 'day';
  selectedDate: string | null = null;
  selectedWeek: number | null = null;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;

  constructor(private consultasService: ConsultasService, private datePipe: DatePipe) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.consultasService.listarVentas().subscribe((ventas: Venta[]) => {
      const ventasFiltradas = this.filtrarDatos(ventas, 'fecha_venta');

      // Extrae el detalle de ventas
      const detalle_venta = ventas.map(v => v.detalle_venta);
      this.ventasData = this.transformVentasData(ventasFiltradas);
      this.productosVendidosData = this.transformProductosVendidosData(ventasFiltradas);
      this.horarioVentasData = this.transformHorarioVentasData(ventasFiltradas);

      this.consultasService.listarPagos().subscribe((pagos) => {
        this.ticketUsoData = this.transformConcentradoPagoData(ventasFiltradas, pagos);
      });
    });
  }

  aplicarFiltro(): void {
    this.loadData();
  }

  private filtrarDatos(datos: any[], campoFecha: string): any[] {
    const today = new Date();
    if (this.selectedFilter === 'day' && this.selectedDate) {
      return datos.filter(d => d[campoFecha] === this.selectedDate);
    } else if (this.selectedFilter === 'week' && this.selectedWeek && this.selectedYear) {
      const startOfWeek = this.getStartOfWeek(this.selectedWeek, this.selectedYear);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
      return datos.filter(d => new Date(d[campoFecha]) >= startOfWeek && new Date(d[campoFecha]) <= endOfWeek);
    } else if (this.selectedFilter === 'month' && this.selectedMonth && this.selectedYear) {
      return datos.filter(d => new Date(d[campoFecha]).getMonth() + 1 === this.selectedMonth && new Date(d[campoFecha]).getFullYear() === this.selectedYear);
    }
    return datos;
  }

  private getStartOfWeek(week: number, year: number): Date {
    const firstDayOfYear = new Date(year, 0, 1);
    const pastDaysOfYear = (week - 1) * 7;
    return new Date(firstDayOfYear.setDate(firstDayOfYear.getDate() + pastDaysOfYear));
  }

  private transformVentasData(ventas: Venta[]): ChartConfiguration['data'] {
    const labels: string[] = [];
    const data: number[] = [];

    const ventasAgrupadas: Record<string, number> = {};
    ventas.forEach(v => {
      const fecha = this.datePipe.transform(v.fecha_venta, 'yyyy-MM-dd');
      if (fecha) {
        ventasAgrupadas[fecha] = (ventasAgrupadas[fecha] || 0) + v.pago_total;
      }
    });

    if (Object.keys(ventasAgrupadas).length === 0) {
      labels.push("Sin datos");
      data.push(0);
    } else {
      for (const fecha in ventasAgrupadas) {
        labels.push(fecha);
        data.push(ventasAgrupadas[fecha]);
      }
    }

    return {
      labels: labels,
      datasets: [
        {
          label: 'Ventas Totales por Día',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  }









  private transformProductosVendidosData(detalle_venta: any[]): ChartConfiguration['data'] {
    const productosPorDia: Record<string, Record<string, number>> = {};

    // Agrupar productos vendidos por día
    detalle_venta.forEach(item => {
      const fecha = this.datePipe.transform(item.fecha_venta, 'yyyy-MM-dd');
      if (fecha) {
        if (!productosPorDia[fecha]) {
          productosPorDia[fecha] = {};
        }
        productosPorDia[fecha][item.detalle_venta] = (productosPorDia[fecha][item.detalle_venta] || 0) + 1;
      }
    });

    const labels: string[] = [];
    const data: number[] = [];

    // Extraer los dos productos más vendidos de cada día
    Object.keys(productosPorDia).forEach(fecha => {
      const productos = Object.entries(productosPorDia[fecha])
        .sort(([, a], [, b]) => b - a)
        .slice(0, 1);  // Obtener los dos más vendidos

      productos.forEach(([nombreProducto, cantidad]) => {
        labels.push(`${fecha} - ${nombreProducto}`);
        data.push(cantidad);
      });
    });

    return {
      labels: labels,
      datasets: [
        {
          label: 'Top Producto mas Vendidos por Día',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }
      ]
    };
}








  private transformHorarioVentasData(ventas: Venta[]): ChartConfiguration['data'] {
    const horas: Record<string, number> = {};
    ventas.forEach(v => {
      const hora = v.hora_venta.split(':')[0];
      horas[hora] = (horas[hora] || 0) + 1;
    });

    return {
      labels: Object.keys(horas).map(hora => `${hora.padStart(2, '0')}:00`),
      datasets: [
        {
          label: 'Ventas por Hora',
          data: Object.values(horas),
          backgroundColor: 'rgba(153, 102, 255, 0.6)',
          borderColor: 'rgba(153, 102, 255, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  private transformConcentradoPagoData(ventas: Venta[], pagos: any[]): ChartConfiguration['data'] {
    const usoPagos = { efectivo: 0, transferencia: 0, paypal: 0 };
    const totalPagos = { efectivo: 0, transferencia: 0, paypal: 0 };

    pagos.forEach(pago => {
      if (pago.TipoPago === 'Efectivo') {
        usoPagos.efectivo++;
        totalPagos.efectivo += pago.CantidadTotal;
      } else if (pago.TipoPago === 'Transferencia') {
        usoPagos.transferencia++;
        totalPagos.transferencia += pago.CantidadTotal;
      }
    });

    ventas.forEach(venta => {
      if (venta.tipo_pago === 'paypal') {
        usoPagos.paypal++;
        totalPagos.paypal += venta.pago_total;
      }
    });

    const data = [usoPagos.efectivo, usoPagos.transferencia, usoPagos.paypal];

    if (data.every(val => val === 0)) {
      data[0] = data[1] = data[2] = 0;
    }

    return {
      labels: ['Efectivo', 'Transferencia', 'PayPal'],
      datasets: [
        {
          label: 'Uso de Tickets',
          data: data,
          backgroundColor: [
            'rgba(255, 99, 132, 0.6)',
            'rgba(54, 162, 235, 0.6)',
            'rgba(255, 206, 86, 0.6)',
          ],
          borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
  }
}
