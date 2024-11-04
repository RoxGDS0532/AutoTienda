import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';



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

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private router: Router) {
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
                
                // Verificar el rol del usuario y redirigir en consecuencia
                if (response.user.Rol === 'Encargado') {
                  this.router.navigate(['/home']);
              } else if (response.user.Rol === 'Administrador') {
                  this.router.navigate(['/consultas']);
              } else {
                  console.warn('Rol desconocido:', response.user.Rol);
              }

                alert('Has iniciado sesión con éxito');
            },
            error: (error) => {
                console.error('Error en el inicio de sesión:', error);
                alert('Error en el inicio de sesión, por favor verifica tus credenciales');
            }
        });
    }
}


  toggleRememberMe(event: any) {
    const isChecked = event.target.checked;
    if (isChecked) {
      localStorage.setItem('rememberMe', 'true');
    } else {
      localStorage.removeItem('rememberMe');
    }
  }

}