import { Component, OnInit } from '@angular/core';
import { ConsultasService } from '../../services/consultas.service';
import { ChartConfiguration, ChartType } from 'chart.js';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { importProvidersFrom } from '@angular/core';

@Component({
  selector: 'app-consultas',
  standalone: true,
  imports: [FormsModule, HttpClientModule, CommonModule, NgChartsModule],
  templateUrl: './consultas.component.html',
  styleUrls: ['./consultas.component.css'],
  providers: [DatePipe]
})
export class ConsultasComponent implements OnInit {
  ventasData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  pagosData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  recibosData: ChartConfiguration['data'] = { labels: [], datasets: [] };
  chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      tooltip: {
        enabled: true,
        callbacks: {
          label: (tooltipItem) => `Valor: ${tooltipItem.raw}`
        }
      },
      legend: {
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    },
    onClick: (event, elements) => this.chartClicked(event, elements)
  };
  barChartType: ChartType = 'bar';
  pieChartType: ChartType = 'pie';
  selectedFilter: string = 'day';
  selectedDate: string | null = null;
  selectedWeek: number | null = null;
  selectedMonth: number | null = null;
  selectedYear: number | null = null;
  selectedBarData: any = null; // Datos de la barra seleccionada

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
    this.loadData();
  }

  private transformVentasData(ventas: any[]): ChartConfiguration['data'] {
    const filteredVentas = this.filtrarDatos(ventas, 'FechaVenta');
    const labels = filteredVentas.map(v => this.datePipe.transform(v.FechaVenta, 'yyyy-MM-dd'));
    const data = filteredVentas.map(v => v.PagoTotal);
    const backgroundColors = data.map(value => this.getColor(value));

    return {
      labels: labels,
      datasets: [
        {
          label: 'Ventas Totales',
          data: data,
          backgroundColor: backgroundColors,
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
    const backgroundColors = data.map(value => this.getColor(value));

    return {
      labels: labels,
      datasets: [
        {
          label: 'Pagos Totales',
          data: data,
          backgroundColor: backgroundColors,
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    };
  }

  private transformRecibosData(recibos: any[]): ChartConfiguration['data'] {
    const filteredRecibos = this.filtrarDatosRecibos(recibos);
    const labels = filteredRecibos.map(r => r.TipoRecibo);
    const data = filteredRecibos.map(r => r.Contador);

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

  private filtrarDatosRecibos(recibos: any[]): any[] {
    if (this.selectedYear && this.selectedMonth) {
      const startOfMonth = new Date(this.selectedYear, this.selectedMonth - 1, 1);
      const endOfMonth = new Date(this.selectedYear, this.selectedMonth, 0);
      return recibos.filter(r => {
        const fecha = new Date(r.FechaRecibo);
        return fecha >= startOfMonth && fecha <= endOfMonth;
      });
    }
    return recibos; // Sin filtro
  }

  private getColor(value: number): string {
    if (value < 50) {
      return 'rgba(255, 99, 132, 0.6)'; // Rojo
    } else if (value < 100) {
      return 'rgba(255, 206, 86, 0.6)'; // Amarillo
    } else {
      return 'rgba(75, 192, 192, 0.6)'; // Verde
    }
  }

  private filtrarDatos(datos: any[], fechaProp: string): any[] {
    const today = new Date();
    let filtroFecha: Date;

    if (this.selectedFilter === 'day' && this.selectedDate) {
      filtroFecha = new Date(this.selectedDate);
      return datos.filter(d => new Date(d[fechaProp]).toDateString() === filtroFecha.toDateString());
    } else if (this.selectedFilter === 'week' && this.selectedWeek) {
      const startOfWeek = this.getStartOfWeek(today, this.selectedWeek);
      const endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(endOfWeek.getDate() + 6);
      return datos.filter(d => {
        const fecha = new Date(d[fechaProp]);
        return fecha >= startOfWeek && fecha <= endOfWeek;
      });
    } else if (this.selectedFilter === 'month' && this.selectedMonth) {
      const startOfMonth = new Date(today.getFullYear(), this.selectedMonth - 1, 1);
      const endOfMonth = new Date(today.getFullYear(), this.selectedMonth, 0);
      return datos.filter(d => {
        const fecha = new Date(d[fechaProp]);
        return fecha >= startOfMonth && fecha <= endOfMonth;
      });
    }
    return datos; // Sin filtro
  }

  private getStartOfWeek(date: Date, week: number): Date {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const daysOffset = (week - 1) * 7; // Cada semana tiene 7 días
    const startOfWeek = new Date(firstDayOfYear);
    startOfWeek.setDate(firstDayOfYear.getDate() + daysOffset);
    return startOfWeek;
  }

  // Método para manejar clics en el gráfico
  chartClicked(event: any, elements: any[]): void {
    if (elements.length > 0) {
      const chartElement = elements[0];
      const datasetIndex = chartElement.datasetIndex;
      const index = chartElement.index;

      // Verificar si ventasData y ventasData.labels están definidos antes de acceder a ellos
      if (this.ventasData && this.ventasData.labels && this.ventasData.labels[index] !== undefined) {
        this.selectedBarData = {
          label: this.ventasData.labels[index],
          value: this.ventasData.datasets[datasetIndex]?.data[index]
        };
      }
    }
  }
}
