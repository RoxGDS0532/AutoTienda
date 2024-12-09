import { Component, OnInit } from '@angular/core';
import { Producto, ProductoService } from '../../services/producto.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'
import { Agotado } from '../../state-producto/agotado.estado'
import { Disponible } from '../../state-producto/disponible.estado';
import { PorAgotarse } from '../../state-producto/porAgotarse.estado';
import { ContextoProducto } from '../../state-producto/contexto';
import * as bootstrap from 'bootstrap';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';  
import { Categoria, CategoriaService } from '../../services/categoria.service';
import { SugerenciasService } from '../../services/sugerencias.service';
import { ProveedorService, Proveedor } from '../../services/proveedor.service';
import { ProductosRecomendadosService, ProductoRecomendado } from '../../services/productos-recomendados.service';
import { ProductosSurtirService, ProductoSurtir } from '../../services/productos-surtir.service';


@Component({
  selector: 'app-detalles-producto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalles-producto.component.html',
  styleUrl: './detalles-producto.component.css',
  providers: [ProductoService, ToastrService, CategoriaService,SugerenciasService]
})

export class DetallesProductoComponent implements OnInit {
  producto: Producto | null = null;
  productoR: Producto = { Id: 0, Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0, CodigoBarras: '', ImagenURL: '' };
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = []; 
  productosRecomendados: ProductoRecomendado[] = []; 
  productosPorProveedor: { [proveedorId: number]: ProductoRecomendado[] } = {};
  contexto: ContextoProducto;
  sugerencia: string | null = null;
  mostrarRecomendaciones = false;
  sugerencias: any | null = null;
  mostrarSugerencias = false;
  sugerenciass: any[] = []; 
  mensaje: string = '';
  productoSeleccionado: ProductoRecomendado | null = null;

  
  constructor(
    private productoService: ProductoService,
    private route: ActivatedRoute, 
    private toastr: ToastrService,
    private sugerenciasService: SugerenciasService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private productosRecomendadosService: ProductosRecomendadosService,
    private productosSurtirService: ProductosSurtirService,
  ) {
    this.contexto = new ContextoProducto(
      new Disponible(this.productoService), 
      this.productosRecomendadosService,  
      this.proveedorService,
      this.productoService,
      this.categoriaService,
    );
  }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      const idNumerico = Number(id); 
      this.obtenerProducto(idNumerico);
    } else {
      console.error('El ID es nulo y no se puede procesar.');
    }
    this.cargarCategorias();
    this.cargarProveedores();
  }

  obtenerProducto(id: number): void {
    this.productoService.obtenerProductoPorId(id).subscribe({
      next: (producto) => {
        console.log('Producto obtenido:', producto);
        this.producto = producto;
        this.actualizarEstado(this.producto);
      },
      error: (error) => {
        console.error('Error al obtener el producto:', error);
      },
    });
  }

  
  cargarProveedores() {
    this.proveedorService.listarProveedores().subscribe(proveedores => {
      this.proveedores = proveedores;
    });
  }

  obtenerNombreProveedor(id: number): string {
    const proveedor = this.proveedores.find(p => p.Id === id);
    return proveedor ? proveedor.Nombre : 'Proveedor no encontrado';
  }

  actualizarEstado(producto: Producto | null): void {
    if (producto !== null) {
      this.contexto.verificarEstado(producto);
  
      if (this.contexto['estado'] instanceof Agotado) {
        const estadoAgotado = this.contexto['estado'] as Agotado;
        estadoAgotado.setProducto(producto);
        estadoAgotado.cargarProductosRecomendados().subscribe(
          productosPorProveedor => {
            this.productosRecomendados = [];
            for (const proveedorId in productosPorProveedor) {
              const productosDelProveedor = productosPorProveedor[proveedorId];
              console.log(`Productos recomendados del proveedor ${proveedorId}:`, productosDelProveedor);              
              this.productosRecomendados.push(...productosDelProveedor);
            }
            this.sugerencia = estadoAgotado.sugerirAccion();
            this.mostrarRecomendaciones = true;
          },
          error => {
            console.error('Error al cargar productos recomendados:', error);
          }
        );
      } else if (this.contexto['estado'] instanceof PorAgotarse) {
        const sugerencia = this.sugerenciasService.generateSugerencias(producto);
        if (sugerencia) {
          this.sugerencias = [sugerencia];
          this.mostrarSugerencias = true;
          
        } else {
          console.error('No se pudo generar sugerencias iniciales');
          this.mostrarSugerencias = false;
        }
      } else {
        this.mostrarRecomendaciones = false;
      }
    } else {
      console.error('Producto es null');
    }
  }





  mandarAProductorSurtir(sugerencia: any): void {
    console.log('Inicio de mandarAProductorSurtir, sugerencia:', sugerencia);
  
    // Validar campos mínimos requeridos
    if (!sugerencia || !sugerencia.productoId || !sugerencia.proveedorId || !sugerencia.cantidadPropuesta) {
      console.error('Sugerencia inválida o datos incompletos:', sugerencia);
      this.toastr.error('Sugerencia inválida o incompleta.', '¡Error!');
      return;
    }
  
    // Construcción del objeto ProductoSurtir usando los datos del producto actual
    const productoSurtir: ProductoSurtir = {
      id: sugerencia.productoId,
      CodigoBarras: this.producto?.CodigoBarras || '0000000000000', // Código de barras del producto actual
      nombre: this.producto?.Nombre || 'Producto desconocido', // Nombre del producto actual
      categoria_id: this.producto?.CategoriaId || 0, // Categoría del producto actual
      id_proveedor: sugerencia.proveedorId,
      cantidadSolicitada: sugerencia.cantidadPropuesta || 1,
      precio: this.producto?.Precio || 0.0, // Precio del producto actual
      imagenUrl: this.producto?.ImagenURL || 'https://example.com/default-image.png' // Imagen del producto actual
    };
  
    console.log('Producto preparado para surtir:', productoSurtir);
  
    // Agregar el producto a la tabla de productos a surtir
    this.productosSurtirService.agregarProducto(productoSurtir).subscribe({
      next: (response) => {
        console.log('Producto agregado a productos a surtir. Respuesta del servidor:', response);
        this.toastr.success('Producto añadido a la lista de surtir.', '¡Éxito!');
      },
      error: (error: any) => {
        console.error('Error al agregar el producto a productos a surtir:', error);
        this.toastr.error('Hubo un error al agregar el producto a surtir.', '¡Error!');
      }
    });
  }
  
  
  
  
  


  
  
  aceptarSugerencia(sugerencia: any): void {
    if (!sugerencia || !sugerencia.proveedorId || !sugerencia.cantidadPropuesta || !sugerencia.productoId) {
      console.error('Datos incompletos en la sugerencia:', sugerencia);
      return;
    }
  
    const proveedor = this.proveedores.find(p => p.Id === sugerencia.proveedorId);
  
    if (!proveedor || !proveedor.Email) {
      console.error('Proveedor no encontrado o correo no disponible.');
      this.toastr.error('El proveedor no tiene un correo válido.', '¡Error!');
      return;
    }
  
    const detallesPedido = {
      correo: proveedor.Email,
      detallesPedido: [
        {
          nombreProducto: sugerencia.productoNombre ?? 'Producto no especificado',
          cantidad: sugerencia.cantidadPropuesta
        }
      ]
    };
  
    console.log('Detalles del pedido a enviar:', detallesPedido);
  
    this.proveedorService.sendOrderEmail(detallesPedido).subscribe({
      next: (response) => {
        console.log('Correo enviado al proveedor:', response);
        
        // Aquí ocultamos las sugerencias y mostramos un mensaje de que el pedido está en proceso
        this.sugerencias = [];
        this.mostrarSugerencias = false;
        
        // Mostrar tarjeta de "Producto en proceso de surtir"
        this.mensajePedidoEnProceso = `El pedido para ${sugerencia.productoNombre} está siendo enviado al proveedor.`;
        console.log('Preparándose para mandar a productor surtir:', sugerencia);
  
        this.mandarAProductorSurtir(sugerencia);
      },
      error: (error) => {
        console.error('Error al enviar el correo al proveedor:', error);
        this.toastr.error('Hubo un error al enviar el correo.', '¡Error!');
      }
    });
  }
  
  // Propiedad para mostrar el mensaje del pedido en proceso
  mensajePedidoEnProceso: string | null = null;
  


 
  






  generarSugerencia(producto: Producto): void {
    const nuevaSugerencia = this.sugerenciasService.generateSugerencias(producto);
    if (nuevaSugerencia) {
      this.sugerencias = [nuevaSugerencia];
      this.mostrarSugerencias = true;
    } else {
      this.mostrarSugerencias = false;
      console.error('No se pudo generar una sugerencia');
    }
  }
  


  rechazarSugerencia(sugerencia: any): void {
    const index = this.sugerencias.findIndex((s: any) => s === sugerencia);

    if (index > -1) {
      this.sugerencias.splice(index, 1);
    }
  
    if (this.sugerencias.length === 0) {
      const nuevaSugerencia = this.sugerenciasService.generarMultiplesSugerencias({
        Id: sugerencia.productoId,
        Nombre: sugerencia.productoNombre,
        CategoriaId: sugerencia.productoCategoriaId,
        Precio: 0,
        CantidadDisponible: 0,
        CodigoBarras: '',
      });
  
      this.sugerencias = nuevaSugerencia;
      this.mostrarSugerencias = this.sugerencias.length > 0;
    }
  }
  

  obtenerProveedorPorCategoria(categoriaId: number): Proveedor | undefined {
    return this.proveedores.find(proveedor => proveedor.Id === categoriaId);
  }
  
  cargarCategorias() {
    this.categoriaService.obtenerCategorias().subscribe(categorias => this.categorias = categorias);
  }

  getCategoriaNombre(categoriaId: number | undefined): string {
    if (categoriaId === undefined) {
      return 'Sin categoría'; 
    }
    const categoria = this.categorias.find(cat => cat.Id === categoriaId);
    return categoria ? categoria.Nombre : 'Categoría no encontrada';
  }

  limpiarFormulario() {
    this.producto = { Id: 0, ImagenURL: '', Nombre: '', Precio: 0, CantidadDisponible: 0, CategoriaId: 0, CodigoBarras: '' };
  }
  
  abrirModalAgregar(producto: Producto | undefined): void {
    if (producto && producto.Id !== undefined && producto.Id > 0 && producto.Nombre !== '') {
      this.productoR = { ...producto };
      console.log('Producto a autollenar:', this.productoR);
    } else {
      console.error('Producto no válido:', producto);
      this.toastr.error('Producto no válido. Por favor, selecciona un producto antes de proceder.', '¡Error!');
    }
  
    setTimeout(() => {
      const agregarModal = new bootstrap.Modal(document.getElementById('agregarProductoModal')!);
      agregarModal.show();
    }, 0);
  }
  
  

  seleccionarProducto(producto: ProductoRecomendado): void {
    console.log('Producto recomendado seleccionado:', producto);
    
    const productoTransformado: Producto = {
      Id: producto.id,
      Nombre: producto.nombre,
      Precio: producto.precio,
      CategoriaId: producto.categoria_id,
      CantidadDisponible: 0,  
      CodigoBarras: producto.CodigoBarras,
      ImagenURL: producto.imagenUrl
    };
  
    this.abrirModalAgregar(productoTransformado);
  }


enviarCorreo(): void {
  if (!this.productoR) {  
    console.error('Producto no está definido.');
    return;
  }

  if (!this.productoR.CategoriaId) {  
    console.error('Proveedor no disponible para el producto.');
    return;
  }

  // Obtener el proveedor correspondient
  const proveedor = this.proveedores.find(p => p.Id === this.productoR.CategoriaId);
  if (!proveedor || !proveedor.Email) {
    console.error('Proveedor no encontrado o correo no disponible.');
    this.toastr.error('El proveedor no tiene un correo válido.', '¡Error!');
    return;
  }

  // Detalles del producto a enviar
  const detallesProducto = {
    nombre: this.productoR.Nombre,
    cantidad: this.productoR.CantidadDisponible,
    precio: this.productoR.Precio,
    categoria: this.getCategoriaNombre(this.productoR.CategoriaId),
    codigoBarras: this.productoR.CodigoBarras,
    imagenURL: this.productoR.ImagenURL
  };

  console.log('Detalles del product:', detallesProducto);
  console.log('Enviando correo al proveedor:', proveedor.Email);

  this.productoService.enviarCorreoProveedor(detallesProducto, proveedor.Email).subscribe({
    next: (respuesta) => {
      console.log('Correo enviado al proveedor:', respuesta);
      this.toastr.success('Correo enviado al proveedor', '¡Éxito!');

      if (this.productoR.Id === undefined) {
        console.error('El ID del producto no está definido');
        this.toastr.error('No se puede eliminar el producto porque el ID no está definido.', '¡Error!');
        return;
      }
      
      this.productosRecomendadosService.eliminarProducto(this.productoR.Id).subscribe({
        next: () => {
          console.log('Producto eliminado de productos recomendados.');
          location.reload();
          this.toastr.success('Producto solicitado al proveedor, Revisa surtir', '¡Éxito!');
          const productoSurtir: ProductoSurtir = {
            id: this.productoR.Id!,
            CodigoBarras: this.productoR.CodigoBarras || '', 
            nombre: this.productoR.Nombre || '', 
            categoria_id: this.productoR.CategoriaId || 0, 
            id_proveedor: this.obtenerProveedorPorCategoria(this.productoR.CategoriaId)?.Id,
            cantidadSolicitada: this.productoR.CantidadDisponible || 0,
            precio: this.productoR.Precio || 0, 
            imagenUrl: this.productoR.ImagenURL || '' 
        };
          // Agregar el producto a la tabla de productos a surtir
          this.productosSurtirService.agregarProducto(productoSurtir).subscribe({
            next: () => {
              console.log('Producto agregado a productos a surtir.');
            },
            error: (error:any) => {
              console.error('Error al agregar el producto a productos a surtir:', error);
              this.toastr.error('Hubo un error al agregar el producto a surtir.', '¡Error!');
            }
          });
        },
        error: (error:any) => {
          console.error('Error al eliminar el producto de productos recomendados:', error);
          this.toastr.error('Hubo un error al eliminar el producto de productos recomendados.', '¡Error!');
        }
      });
      
      // Cerrar el modal
      const modalElement = document.getElementById('agregarProductoModal');
      if (modalElement) {
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance?.hide();
      }
    },
    error: (error) => {
      console.error('Error al enviar el correo:', error);
      this.toastr.error('Hubo un error al enviar el correo al proveedor.', '¡Error!');
    }
  });
}
}