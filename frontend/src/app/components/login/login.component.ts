import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';



@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
  providers: [AuthService]
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.loginForm = this.formBuilder.group({
      correo: ['', Validators.required],  // Cambia el nombre de usuario a correo
      contrasena: ['', Validators.required] // Cambia la contraseña a contrasena
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
        const { correo, contrasena } = this.loginForm.value;
        this.authService.login(correo, contrasena).subscribe({
            next: (response) => {
                console.log('Inicio de sesión exitoso:', response);
                
            },
            error: (error) => {
                console.error('Error en el inicio de sesión:', error);
                // Mostrar mensaje de error al usuario
            }
        });
    }
}

}