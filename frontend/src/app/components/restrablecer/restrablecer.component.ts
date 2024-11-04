import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsuarioService } from '../../services/usuario.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-restrablecer',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './restrablecer.component.html',
  styleUrl: './restrablecer.component.css',
  providers: [UsuarioService]
})
export class RestrablecerComponent {
  forgotPasswordForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private usuarioService: UsuarioService) {
    this.forgotPasswordForm = this.formBuilder.group({
      correo: ['', [Validators.required, Validators.email]]
    });
  }

  onResetPassword() {
    if (this.forgotPasswordForm.valid) {
      const { correo } = this.forgotPasswordForm.value;
      this.usuarioService.resetPassword(correo).subscribe({
        next: (response) => {
          console.log('Solicitud de restablecimiento de contraseña enviada:', response);
        },
        error: (error) => {
          console.error('Error al enviar solicitud de restablecimiento:', error);
        }
      });
    }
  }

  
}
