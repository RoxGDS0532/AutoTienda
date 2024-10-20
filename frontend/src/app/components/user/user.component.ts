import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Producto {
  codigo: string;
  nombre: string;
  precio: number;
  cantidad: number;
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {
  carrito: Producto[] = [];
  total: number = 0;
  metodosDePago: string[] = ['Tarjeta', 'Efectivo', 'Vales'];
  metodoSeleccionado: string = '';
  facturaGenerada: boolean = false;

   // Agregar producto escaneado al carrito
   agregarProducto(codigo: string) {
    const producto = this.buscarProductoPorCodigo(codigo);
    if (producto) {
      const itemEnCarrito = this.carrito.find(p => p.codigo === producto.codigo);
      if (itemEnCarrito) {
        itemEnCarrito.cantidad++;
      } else {
        this.carrito.push({ ...producto, cantidad: 1 });
      }
      this.calcularTotal();
    }
  }

  // Simulación de la búsqueda de productos por código de barras
  buscarProductoPorCodigo(codigo: string): Producto | undefined {
    const productosDisponibles: Producto[] = [
      { codigo: '123', nombre: 'Producto 1', precio: 50, cantidad: 1 },
      { codigo: '456', nombre: 'Producto 2', precio: 75, cantidad: 1 }
    ];
    return productosDisponibles.find(p => p.codigo === codigo);
  }

  // Calcular total
  calcularTotal() {
    this.total = this.carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
  }

  // Modificar cantidad en el carrito
  modificarCantidad(codigo: string, cantidad: number) {
    const producto = this.carrito.find(p => p.codigo === codigo);
    if (producto && cantidad > 0) {
      producto.cantidad = cantidad;
      this.calcularTotal();
    }
  }

  // Eliminar producto del carrito
  eliminarProducto(codigo: string) {
    this.carrito = this.carrito.filter(p => p.codigo !== codigo);
    this.calcularTotal();
  }

  // Procesar el pago
  procesarPago() {
    if (this.metodoSeleccionado) {
      // Aquí se podría implementar la lógica específica de cada método de pago.
      alert(`Pago realizado con ${this.metodoSeleccionado}. Total: ${this.total}`);
      this.generarFactura();
      this.carrito = [];
      this.total = 0;
    } else {
      alert('Selecciona un método de pago');
    }
  }

  // Generar factura
  generarFactura() {
    this.facturaGenerada = true;
    // Aquí podrías agregar la lógica para generar la factura.
  }
}
