import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.css',
  providers: [UsuarioService]
})
export class RegistroComponent {
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService, private router: Router) {
    this.registerForm = this.formBuilder.group({
      Nombre: ['', Validators.required],
      Correo: ['', [Validators.required, Validators.email]],
      Contrasena: ['', Validators.required],
      Rol: ['Encargado']
    });
  }

  onRegister() {
    if (this.registerForm.valid) {
      const usuarioData = this.registerForm.value;
      this.usuarioService.crearUsuario(usuarioData).subscribe({
        next: (response) => {
          console.log('Usuario registrado exitosamente:', response);
          this.router.navigate(['/login']);
          alert('Usuario registrado con éxito');
        },
        error: (error) => {
          console.error('Error al registrar el usuario:', error.message, error.status, error.error);
          alert('Error en el registro de usuario, por favor verifica tus credenciales');
        }
      });
    }
  }
}