import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Importar FormsModule
import { ActivatedRoute } from '@angular/router';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Producto, ProductoService } from '../../services/producto.service';
import { DetalleVentaSinID, Venta, VentasService } from '../../services/ventas.service';
import { FacturaService } from '../../services/factura.service';
import { ToastrService } from 'ngx-toastr';
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { Disponible } from '../../state-producto/disponible.estado';

declare var paypal:any;
@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
  
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
  codigoProductoBuscado: string = ''; // Manual
  // productoEncontrado: Producto | null = null; // Manual
  // productoBuscado: boolean = false; // Manual
  productosEnPromocion: Producto[] = [];
  categorias: Categoria[] = [];
  productosPorCategoria: { [categoria: string]: Producto[] } = {};

  @ViewChild('video') videoElement: ElementRef | undefined;
  @ViewChild('paypal', { static: true }) paypalElement!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private productoService: ProductoService,
    private ventas: VentasService,
    private httpclient: HttpClient,
    private facturaService: FacturaService,
    private toastr: ToastrService,
    private categoriaService:CategoriaService
  ) {}

  ngOnInit(): void {
    const codigoBarras = this.route.snapshot.paramMap.get('codigoBarras');
    if (codigoBarras) {
      this.buscarProductoPorCodigo(codigoBarras);
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

         this.cerrarModalPago();
         
         //alert('Pago completado. El carrito se ha vaciado.');
      },
      onError: (err:any) => {
        console.error('Error al pagar:', err);
      }
    }).render(this.paypalElement.nativeElement);


    this.categoriaService.obtenerCategorias().subscribe((categorias) => {
      this.categorias = categorias;

      this.productoService.obtenerProductos().subscribe((productos) => {
        this.productoService.obtenerProductosPromocion().subscribe((productosPromocion) => {
          this.productosEnPromocion = productosPromocion;
          this.verificarPromociones();
          this.clasificarPorCategoria();
        });
      });
    });
  }

  verificarPromociones(): void {
    const estadoDisponible = new Disponible(this.productoService, this.productosEnPromocion);

    this.productos.forEach((producto) => {
      estadoDisponible.sugerirAccion(producto);
    });
  }

  clasificarPorCategoria(): void {
    this.productosEnPromocion.forEach((producto) => {
      const categoria = this.categorias.find(c => c.Id === producto.CategoriaId)?.Nombre || 'Sin Categoría';

      if (!this.productosPorCategoria[categoria]) {
        this.productosPorCategoria[categoria] = [];
      }
      this.productosPorCategoria[categoria].push(producto);
    });
  }

  guardarVenta(): void {
    const fechaVenta = new Date();
    const venta: Venta = {
      fecha_venta: fechaVenta,
      hora_venta: fechaVenta,
      pago_total: this.obtenerTotal(),
      tipo_pago: 'paypal',
      detalles: this.productos.map(producto => ({
        id_producto: producto.Id ?? 0, 
        cantidad: producto.CantidadEnCarrito ?? 0,
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
          const codigoEscaneado = result.getText();

          const beepSound = new Audio('assets/sound/beep.mp3');
          beepSound.play();

          console.log('Código escaneado:', codigoEscaneado);
          this.buscarProductoPorCodigo(codigoEscaneado);
        })
        .catch(err => console.error('Error al escanear:', err));
    }
  }

  buscarProductoPorCodigo(codigoBarras: string): void {
    console.log('Buscando producto con código de barras:', codigoBarras);
    const productoExistente = this.productos.find(p => p.CodigoBarras === codigoBarras);

    if (productoExistente) {
      console.log('Producto existente encontrado:', productoExistente); // producto existe
      productoExistente.CantidadEnCarrito = (productoExistente.CantidadEnCarrito || 0) + 1;
    } else {
      this.productoService.obtenerProductoPorCodigoBarras(codigoBarras).subscribe({
        next: (data) => {
          console.log('Producto encontrado en la base de datos:', data); // producto recuperado
          data.CantidadEnCarrito = 1; 
          this.productos.push(data); 
          console.log('Producto agregado al carrito:', this.productos); // carrito actualizado

        },
        error: (err) => console.error('Producto no encontrado', err)
      });
    }
  }

  incrementarCantidad(producto: Producto): void {
    if (producto.CantidadEnCarrito === undefined) {
      producto.CantidadEnCarrito = 0; // Inicializa en 0 si es undefined
    }

    console.log('Cantidad en carrito:', producto.CantidadEnCarrito);
    console.log('Cantidad disponible:', producto.CantidadDisponible);

    if (producto.CantidadEnCarrito < producto.CantidadDisponible) {
      producto.CantidadEnCarrito += 1;
    } else {
      this.toastr.error('No se puede incrementar más la cantidad. Stock agotado.', '¡Error!');
    }
  }
  
  
  decrementarCantidad(producto: Producto): void {
    if (producto.CantidadEnCarrito === undefined) {
      producto.CantidadEnCarrito = 0; // Inicializa en 0 si es undefined
    }

    if (producto.CantidadEnCarrito > 1) {
      producto.CantidadEnCarrito -= 1;
    }else{
      this.eliminarProducto(producto);
    }
  }
  
  eliminarProducto(producto: Producto): void {
    this.productos = this.productos.filter(p => p !== producto);
  }

    obtenerSubtotal(): number {
      return this.productos.reduce((acc, producto) => {const cantidadEnCarrito = producto.CantidadEnCarrito ?? 0; // Si es undefined, asigna 0
      const precio = producto.Precio ?? 0; // Si es undefined, asigna 0
      return acc + precio * cantidadEnCarrito;
    }, 0);
    }
  
    obtenerAhorros(): number {
      if (this.descuentoAplicado) {
        return this.productos.reduce((acc, producto) => {const cantidadEnCarrito = producto.CantidadEnCarrito ?? 0; // Si es undefined, asigna 0
        const precio = producto.Precio ?? 0; // Si es undefined, asigna 0
        return acc + precio * cantidadEnCarrito * 0.1;}, 0); 
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
    if (!this.correoCliente) {
      console.error('Correo del cliente no está definido.');
      return;
    }
  
    const detallesVenta: DetalleVentaSinID[] = this.productos.map(producto => ({
      id_producto: producto.Id?? 0, 
      nombre: producto.Nombre,
      cantidad: producto.CantidadEnCarrito ??0,
      precio_unitario: producto.Precio,
      total_pago: (producto.CantidadEnCarrito ?? 0) * (producto.Precio ?? 0)
    }));
  
    this.ventas.sendEmail(this.correoCliente, detallesVenta).subscribe({
      next: (respuesta) => {
        console.log('Correo enviado:', respuesta);
        this.cerrarModalFactura();
        this.limpiarCarrito();
      },
      error: (error) => {
        console.error('Error al enviar el correo:', error);
      }
    });
  }

  limpiarCarrito(){
          this.productos = [];
          this.descuentoAplicado = false;
          this.codigoDescuento = '';
  }

  buscarProductoPorCodigoManual(): void {
    const codigoBarras = this.codigoProductoBuscado;
  
    console.log('Buscando producto manualmente con código de barras:', codigoBarras);
  
    // Verifica si el producto ya está en el carrito
    const productoExistente = this.productos.find(p => p.CodigoBarras === codigoBarras);
  
    if (productoExistente) {
      console.log('Producto existente encontrado en el carrito:', productoExistente);
  
      // Validar que no se exceda el stock disponible
      if (productoExistente.CantidadEnCarrito! < productoExistente.CantidadDisponible!) {
        productoExistente.CantidadEnCarrito = (productoExistente.CantidadEnCarrito || 0) + 1;
        console.log('Cantidad actualizada en el carrito:', productoExistente.CantidadEnCarrito);
      } else {
        this.toastr.error('No se puede incrementar más la cantidad. Stock agotado.', '¡Error!');
      }
    } else {
      // Si no está en el carrito, busca en la base de datos
      this.productoService.obtenerProductoPorCodigoBarras(codigoBarras).subscribe({
        next: (data) => {
          console.log('Producto encontrado en la base de datos:', data);
  
          // Validar que haya stock disponible antes de agregar al carrito
          if (data.CantidadDisponible! > 0) {
            data.CantidadEnCarrito = 1; // Inicializa la cantidad en 1
            this.productos.push(data); // Agrega el nuevo producto al carrito
            console.log('Producto agregado al carrito:', this.productos); // Muestra el carrito actualizado
          } else {
            this.toastr.error('El producto está agotado y no puede añadirse al carrito.', '¡Error!');
          }
        },
        error: (err) => this.toastr.error('Producto no encontrado', '¡Error!')
      });
    }
  }
  
  
    generarFacturaCompra() {
      const facturaData = {
        fecha: new Date(),
        clienteCorreo: 'roxana.ort100@gmail.com',
        productos: [
          { nombre: 'Producto A', cantidad: 2, precioUnitario: 50, total: 100 },
          { nombre: 'Producto B', cantidad: 1, precioUnitario: 30, total: 30 },
        ],
        subtotal: 130,
        descuento: 0,
        total: 130
      };

      this.facturaService.generarFactura(facturaData).subscribe((pdfBlob) => {
        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'factura.pdf';
        link.click();
        window.URL.revokeObjectURL(url); // Limpiar la URL creada
      });
    }
  }
    