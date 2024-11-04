import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { BrowserMultiFormatReader } from '@zxing/browser';
import { VentasService, Venta } from '../../services/ventas.service';
import * as bootstrap from 'bootstrap';

declare var paypal:any;
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css'
})
export class CarritoComponent implements OnInit {
  title = 'angular-paypal-payment'
  productos:  Producto[] = [];
  codeReader = new BrowserMultiFormatReader();
  codigoDescuento: string = '';
  descuentoAplicado: boolean = false;
  
  @ViewChild('video') videoElement: ElementRef | undefined;
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private ventas: VentasService,
  ) {}

  ngOnInit(): void {
    
    const codigoBarras = this.route.snapshot.paramMap.get('codigoBarras');
    if (codigoBarras) {
      this.buscarProductoPorCodigo(+codigoBarras);
    }

    this.iniciarEscaneoContinuo();

    paypal.Buttons({
      createOrder: (data:any, actions:any) => {
        return actions.order.create({
          purchase_units: [{
            amount: {
              currency_code: 'MXN',
              value: this.obtenerTotal().toFixed(2) 
            }
          }]
        });
      },
      onApprove: async (data:any, actions:any) => {
        const order = await actions.order.capture();
        console.log('Orden capturada:', order);

        this.guardarVenta();

         this.productos = [];
         this.descuentoAplicado = false;
         this.codigoDescuento = '';
         
         //alert('Pago completado. El carrito se ha vaciado.');
         // Cerrar el modal de pago
         const modalElement = document.getElementById('paymentModal');
         if (modalElement) {
           (modalElement as any).classList.remove('show');
           modalElement.setAttribute('aria-hidden', 'true');
           modalElement.setAttribute('style', 'display: none');
           document.body.classList.remove('modal-open');
           const modalBackdrop = document.querySelector('.modal-backdrop');
           if (modalBackdrop) {
             modalBackdrop.remove();
           }
         }
      },
      onError: (err:any) => {
        console.error('Error al pagar:', err);
      }
    }).render(this.paypalElement.nativeElement);
  }

  guardarVenta(): void {
    const fechaVenta = new Date();
    const venta: Venta = {
      fecha_venta: fechaVenta,
      hora_venta: fechaVenta,
      pago_total: this.obtenerTotal(),
      tipo_pago: 'paypal',
      detalles: this.productos.map(producto => ({
        id_producto: producto.Id ?? 0, // Usa 0 o un valor predeterminado si producto.Id es undefined
        cantidad: producto.Cantidad,
        precio_unitario: producto.Precio
      }))
    };

    this.ventas.registrarVenta(venta).subscribe({
      next: (respuesta) => {
        console.log('Venta guardada en la base de datos:', respuesta);
      },
      error: (error) => {
        console.error('Error al guardar la venta:', error);
      }
    });
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

  pagarEnEfectivo() {
    console.log('Pago en efectivo seleccionado');
    // Lógica para procesar el pago en efectivo
  }
}
