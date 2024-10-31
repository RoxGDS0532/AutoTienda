import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { ProductoService } from '../../services/producto.service';

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
  codigoEscaneado: string | undefined;  

  constructor(private productoService: ProductoService) {}  


  // Método para iniciar el escaneo de código de barras
  iniciarEscaneo() {
    // Llama a la cámara para escanear una vez
    this.codeReader.decodeOnceFromVideoDevice(undefined, 'video').then(result => {
      this.codigoEscaneado = result.getText();  // Guarda el código escaneado en la propiedad

      // Reproduce el sonido "beep" al escanear con éxito
      const beepSound = new Audio('assets/sound/beep.mp3');
      beepSound.play();

      // Busca el producto con el código escaneado
      this.productoService.obtenerProductoPorCodigoBarras(this.codigoEscaneado).subscribe(
        (producto) => {
          this.productoSeleccionado = producto;
          this.codigoEscaneado = undefined;  // Limpia el código escaneado{
          this.mensajeError = undefined;  // Limpia el mensaje de error
        },
        (error) =>{
          this.productoSeleccionado = undefined; 
          this.mensajeError = 'Producto no encontrado';
          console.error('Error al buscar el producto:', error);
        }
      );
    }).catch(err => {
      this.mensajeError = 'Error al escanear el código de barras';
      console.error(err);
    });
  }
}
