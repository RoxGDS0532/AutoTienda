import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ProductoService} from '../../services/producto.service';
import { Router } from '@angular/router';
import { Result } from '@zxing/library'; // Importa el tipo Result


interface Producto {
  Id?: number;
  ImagenURL?: string;
  Nombre: string;
  CategoriaId: number; // Asegúrate de que esta propiedad exista aquí
  Precio: number;
  CantidadDisponible: number;
  CantidadEnCarrito?: number;
  CodigoBarras?: string; 
}

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  codeReader = new BrowserMultiFormatReader();
  productoSeleccionado: Producto | undefined;
  mensajeError: string | undefined;
  codigoEscaneado: string | undefined; 

  constructor(private productoService: ProductoService, private router: Router
  ) {} 

  // Método para iniciar el escaneo de código de barras
iniciarEscaneo() {
  this.codeReader.decodeOnceFromVideoDevice(undefined, 'video').then(result => {
    this.codigoEscaneado = result.getText();
    console.log(result.getText());

    // Reproduce el sonido 
    const beepSound = new Audio('assets/sound/beep.mp3');
    beepSound.play();

    this.buscarProductoEnBaseDeDatos(this.codigoEscaneado!);
    this.router.navigate(['/carrito', this.codigoEscaneado]);
  }).catch(err => {
    this.mensajeError = 'Error al escanear el código de barras';
    console.error(err);
  });
}

// Busca producto en la base de datos
buscarProductoEnBaseDeDatos(codigo: string) {
  this.productoService.obtenerProductoPorCodigoBarras(codigo).subscribe(
    producto => {
      this.productoSeleccionado = producto;
      this.mensajeError = undefined; 
    },
    error => {
      this.productoSeleccionado = undefined;
      this.mensajeError = 'Producto no encontrado';
      console.error(error);
    }
  );
}

}