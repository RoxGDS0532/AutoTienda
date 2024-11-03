import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { BrowserMultiFormatReader } from '@zxing/browser';
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  productos:  Producto[] = [];
  codeReader = new BrowserMultiFormatReader();
  codigoDescuento: string = '';
  descuentoAplicado: boolean = false;
  
  @ViewChild('video') videoElement: ElementRef | undefined;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService
  ) {}

  ngOnInit(): void {
    
    const codigoBarras = this.route.snapshot.paramMap.get('codigoBarras');
    if (codigoBarras) {
      this.buscarProductoPorCodigo(+codigoBarras);
    }

    this.iniciarEscaneoContinuo();
  }

  iniciarEscaneoContinuo(): void {
    if (this.videoElement) {
      this.codeReader.decodeOnceFromVideoDevice(undefined, this.videoElement.nativeElement)
        .then(result => {
          const codigoEscaneado = +result.getText();

          const beepSound = new Audio('assets/sound/beep.mp3');
          beepSound.play();

          console.log('Código escaneado:', codigoEscaneado);
          this.buscarProductoPorCodigo(codigoEscaneado);
        })
        .catch(err => console.error('Error al escanear:', err));
    }
  }

  buscarProductoPorCodigo(codigoBarras: number): void {
    const productoExistente = this.productos.find(p => p.CodigoBarras === codigoBarras);

    if (productoExistente) {
      productoExistente.Cantidad += 1;
    } else {
      this.productoService.obtenerProductoPorCodigoBarras(codigoBarras).subscribe({
        next: (data) => {
          data.Cantidad = 1; 
          this.productos.push(data); 
        },
        error: (err) => console.error('Producto no encontrado', err)
      });
    }
  }

  incrementarCantidad(producto: Producto): void {
    producto.Cantidad += 1;
  }
  
  decrementarCantidad(producto: Producto): void {
    if (producto.Cantidad > 1) {
      producto.Cantidad -= 1;
    }else{
      this.eliminarProducto(producto);
    }
  }
  
  eliminarProducto(producto: Producto): void {
    this.productos = this.productos.filter(p => p !== producto);
  }

    obtenerSubtotal(): number {
      return this.productos.reduce((acc, producto) => acc + producto.Precio * producto.Cantidad, 0);
    }
  
    obtenerAhorros(): number {
      if (this.descuentoAplicado) {
        return this.productos.reduce((acc, producto) => acc + producto.Precio * producto.Cantidad * 0.1, 0); 
      }
      return 0;
    }

    aplicarCodigoDescuento(): void {
      const codigoValido = 'DESCUENTO10'; 
      this.descuentoAplicado = this.codigoDescuento === codigoValido;
    }

  obtenerTotal(): number {
    return this.obtenerSubtotal() - this.obtenerAhorros();
  }

  pagarConTarjeta() {
    console.log('Pago con tarjeta seleccionado');
    // Lógica para procesar el pago con tarjeta
  }

  pagarEnEfectivo() {
    console.log('Pago en efectivo seleccionado');
    // Lógica para procesar el pago en efectivo
  }
}
