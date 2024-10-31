import { Component, OnInit } from '@angular/core';
import { ConsultasService } from '../../services/consultas.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgChartsModule} from 'ng2-charts';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, NgChartsModule],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  providers: [DatePipe]
})

export class ConsultasComponent implements OnInit {
  ventasData!: ChartConfiguration['data'];
  pagosData!: ChartConfiguration['data'];
  recibosData!: ChartConfiguration['data'];
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    }
  };
  barChartType: ChartType = 'bar';
  pieChartType: ChartType = 'pie';
  selectedFilter: string = 'day';

  constructor(
    private consultasService: ConsultasService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.consultasService.listarVentas().subscribe((ventas) => {
      this.ventasData = this.transformVentasData(ventas);
    });

    this.consultasService.listarPagos().subscribe((pagos) => {
      this.pagosData = this.transformPagosData(pagos);
    });

    this.consultasService.listarRecibos().subscribe((recibos) => {
      this.recibosData = this.transformRecibosData(recibos);
    });
  }

  aplicarFiltro(): void {
    this.loadData();  // Recarga los datos con el filtro aplicado
  }

  private transformVentasData(ventas: any[]): ChartConfiguration['data'] {
    const filteredVentas = this.filtrarDatos(ventas, 'FechaVenta');
    const labels = filteredVentas.map(v => this.datePipe.transform(v.FechaVenta, 'yyyy-MM-dd'));
    const data = filteredVentas.map(v => v.PagoTotal);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Ventas Totales',
          data: data,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  private transformPagosData(pagos: any[]): ChartConfiguration['data'] {
    const filteredPagos = this.filtrarDatos(pagos, 'FechaPago');
    const labels = filteredPagos.map(p => this.datePipe.transform(p.FechaPago, 'yyyy-MM-dd'));
    const data = filteredPagos.map(p => p.CantidadTotal);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Pagos Totales',
          data: data,
          backgroundColor: 'rgba(255, 99, 132, 0.6)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  private transformRecibosData(recibos: any[]): ChartConfiguration['data'] {
    const labels = recibos.map(r => r.TipoRecibo);
    const data = recibos.map(r => r.Contador);

    return {
      labels: labels,
      datasets: [
        {
          label: 'Recibos',
          data: data,
          backgroundColor: [
            'rgba(75, 192, 192, 0.6)',
            'rgba(153, 102, 255, 0.6)',
            'rgba(255, 206, 86, 0.6)',
            'rgba(231, 233, 237, 0.6)',
          ],
          borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(231, 233, 237, 1)',
          ],
          borderWidth: 1
        }
      ]
    };
  }

  private filtrarDatos(datos: any[], fechaProp: string): any[] {
    const hoy = new Date();
    let inicioFiltro: Date;

    switch (this.selectedFilter) {
      case 'day':
        inicioFiltro = new Date(hoy);
        break;
      case 'week':
        inicioFiltro = new Date(hoy);
        inicioFiltro.setDate(inicioFiltro.getDate() - 7);
        break;
      case 'month':
        inicioFiltro = new Date(hoy);
        inicioFiltro.setMonth(inicioFiltro.getMonth() - 1);
        break;
      default:
        inicioFiltro = new Date(hoy);
    }

    return datos.filter(d => new Date(d[fechaProp]) >= inicioFiltro);
  }
}
