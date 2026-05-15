import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {NgClass} from '@angular/common';
import {AuthCookieService} from '../../../../core/services/cookies/auth-cookie.service';
import {AuthService} from '../../../../core/services/usuarios/auth.service';
// Proyecto: Reelyx
// Autora: Samantha Sofía Parra Riera
// Descripción: Componente encargado del inicio de sesión de usuarios.

type DatosDeEnvio = { email?: string, password: string };

@Component({
  selector: 'app-login',
  imports: [
    RouterLink, ReactiveFormsModule

  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})


export class Login {

  formLogin: FormGroup;
  esCorreo: boolean = true;
  esLogin: boolean = true;

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService,
              private authCookieService: AuthCookieService,
              private router: Router) {

    this.formLogin = this.formBuilder.group({
      "email": ["", [Validators.email, Validators.minLength(5)]],
      "password": ["", [Validators.required, Validators.minLength(5)]],
    })

  }

  navMain() {
    this.router.navigate(['/']);
  }

  iniciarSesion() {
    // Comprobamos que el formulario sea válido antes de enviar los datos
    if (this.formLogin.invalid) {
      alert("Formulario invalido")
      return;
    }
  // Datos enviados al backend para iniciar sesión
    const datosEnviar: DatosDeEnvio = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    }

    this.authService.login(datosEnviar).subscribe({
      next: (response: any) => {
        console.log(response);
        if (response.success == true) {
          // Guardamos el token (JWT) para mantener la sesión iniciada
          this.authCookieService.set("reelyx_token", response.data.token);
          // Guardamos el email para comprobar permisos y perfiles del user
          sessionStorage.setItem('user_email', response.data.email);

          // Si el login es correcto, llevamos al usuario a la página principal
          this.router.navigate(["/"]);
        } else {
          alert("Usuario o contraseña incorrectos");
        }
      },

      error: (error: any) => {
        console.log(error);
        alert("Error al iniciar sesión");
      }
    })


  }


}
