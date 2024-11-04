import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService, Producto } from '../../services/producto.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { BrowserMultiFormatReader } from '@zxing/browser';
import { VentasService, Venta } from '../../services/ventas.service';
import { HttpClient } from '@angular/common/http';

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
  idFacturaGenerada: string | undefined;
  correoCliente: string = '';
  mostrarCampoCorreo: boolean = false;
  
  @ViewChild('video') videoElement: ElementRef | undefined;
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private ventas: VentasService,
    private httpclient: HttpClient,
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
        this.mostrarModalFactura();
        //this.generarFactura();
        
        this.solicitarCorreoCliente();

        //  this.productos = [];
        //  this.descuentoAplicado = false;
        //  this.codigoDescuento = '';

         this.cerrarModalPago();
         
         //alert('Pago completado. El carrito se ha vaciado.');
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
    console.log('Buscando producto con código de barras:', codigoBarras);
    const productoExistente = this.productos.find(p => p.CodigoBarras === codigoBarras);

    if (productoExistente) {
      console.log('Producto existente encontrado:', productoExistente); // Ver qué producto existe
      productoExistente.Cantidad += 1;
    } else {
      this.productoService.obtenerProductoPorCodigoBarras(codigoBarras).subscribe({
        next: (data) => {
          console.log('Producto encontrado en la base de datos:', data); // Ver el producto recuperado
          data.Cantidad = 1; 
          this.productos.push(data); 
          console.log('Producto agregado al carrito:', this.productos); // Mostrar el carrito actualizado

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

  // Métodos para manejar el modal
  mostrarModalFactura(): void {
    const modalElement = document.getElementById('invoiceModal');
    if (modalElement) {
      (modalElement as any).classList.add('show');
      modalElement.setAttribute('aria-hidden', 'false');
      modalElement.setAttribute('style', 'display: block');
      document.body.classList.add('modal-open');
    }
  }

  cerrarModalFactura(): void {
    const modalElement = document.getElementById('invoiceModal');
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
  }

  cerrarModalPago(): void {
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
  }

  // Método para solicitar el correo del cliente
  solicitarCorreoCliente(): void {
    this.mostrarCampoCorreo = true;
  }
 
  enviarCorreoCliente(): void {
    // Asegurarse de que el correo del cliente esté definido
    if (!this.correoCliente) {
      console.error('Correo del cliente no está definido.');
      return;
    }
    
    // Crear el objeto de detalles de la venta
    const detallesVenta = this.productos.map(producto => ({
      id_producto: producto.Id ?? 0,
      cantidad: producto.Cantidad,
      precio_unitario: producto.Precio
    }));
  
    // Llamar al método del servicio para enviar el correo
    this.ventas.sendEmail(this.correoCliente, detallesVenta).subscribe({
      next: (respuesta) => {
        console.log('Correo enviado:', respuesta);
        // Puedes cerrar el modal o mostrar un mensaje de éxito aquí
        this.cerrarModalFactura();
      },
      error: (error) => {
        console.error('Error al enviar el correo:', error);
        // Puedes mostrar un mensaje de error al usuario aquí
      }
    });
  }
  

}