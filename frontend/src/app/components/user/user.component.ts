import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader } from '@zxing/browser';

interface Producto {
  Id?: number;
  CodigoBarras: string;
  Nombre: string;
  Categoria: string;
  Precio: number;
  Cantidad: number;
  Stock:number;
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
  codigoEscaneado: string | undefined;  // Almacena el código escaneado


  // Simulación de la búsqueda de productos por código de barras
  buscarProductoPorCodigo(codigo: string): Producto | undefined {
    const productosDisponibles: Producto[] = [
  
    ];
    return productosDisponibles.find(p => p.CodigoBarras === codigo);
  }

  // Método para iniciar el escaneo de código de barras
  iniciarEscaneo() {
    // Llama a la cámara para escanear una vez
    this.codeReader.decodeOnceFromVideoDevice(undefined, 'video').then(result => {
      this.codigoEscaneado = result.getText();  // Guarda el código escaneado en la propiedad

      // Reproduce el sonido "beep" al escanear con éxito
      const beepSound = new Audio('assets/sound/beep.mp3');
      beepSound.play();

      // Busca el producto con el código escaneado
      this.productoSeleccionado = this.buscarProductoPorCodigo(this.codigoEscaneado);

      if (!this.productoSeleccionado) {
        this.mensajeError = 'Producto no encontrado';
      } else {
        this.mensajeError = undefined;
      }
    }).catch(err => {
      this.mensajeError = 'Error al escanear el código de barras';
      console.error(err);
    });
  }
}