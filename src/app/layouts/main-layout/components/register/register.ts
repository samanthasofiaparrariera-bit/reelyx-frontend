import {Component, output} from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {EmailValidator} from "../../../../core/validators/email.validator";
import {checkPassValidator} from '../../../../core/validators/password.validator';
import {AuthService} from "../../../../core/services/usuarios/auth.service";
import {Router, RouterLink} from '@angular/router';
import Swal from 'sweetalert2';
// Proyecto: Reelyx
// Autora: Samantha Sofía Parra Riera
// Descripción: Componente encargado del registro y verificación de usuarios.


@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  registerForm: FormGroup;
  cambiarForm = output<boolean>();
  fnToggleLoginHeader = output();
  // Controla cuándo mostrar el apartado de verificación(código)
  codigoEnviado = false;
  emailRegistrado = '';
  // Código que se envia al mail del user
  codigoInput = '';

  constructor(private formBuilder: FormBuilder,
              private authService: AuthService, private router: Router) {

    this.registerForm = this.formBuilder.group({
      "nombre": ["", [Validators.required]],
      "email": ["", [Validators.required, EmailValidator]],
      "password1": ["", [Validators.required, Validators.minLength(6), checkPassValidator]],
      "password2": ["", [Validators.required]],
    })
  }

  register() {
    if (this.registerForm.invalid) {
      return;
    }

    this.emailRegistrado = this.registerForm.value.email;

// Datos enviados al backend para registrar el usuario
    const dataEnviar = {
      email: this.registerForm.value.email,
      nombre: this.registerForm.value.nombre,
      password: this.registerForm.value.password1,
      password2: this.registerForm.value.password2,
    };

    this.authService.registro(dataEnviar).subscribe({
      next: (data: any) => {
        // Si el registro sale bien, mostramos el formulario de verificación.
        this.codigoEnviado = true;
      },
      error: (e: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error al registrarse',
          text: 'Inténtalo de nuevo.',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff',
        });
      }
    });
  }

  verificarCodigo() {
// Comprobamos que el usuario haya escrito un código válido
    if (!this.codigoInput || this.codigoInput.length !== 6) {
      Swal.fire({
        icon: 'warning',
        title: 'Código incompleto',
        text: 'Introduce el código de 6 dígitos.',
        background: '#151315',
        color: '#ffffff',
        confirmButtonColor: '#884aff',
      });
      return;
    }
    // Se envia el email y el code al backend para activar la cuenta del user
    this.authService.verificarCodigo({
      email: this.emailRegistrado,
      codigo: this.codigoInput
    }).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Cuenta verificada',
          text: '¡Ya puedes iniciar sesión!',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff',
        }).then(() => {
          // Después de la verificación, llevamos al usuario al login.
          this.router.navigate(['/login']);
        });
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Código incorrecto',
          text: 'Revisa el código e inténtalo de nuevo.',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff',
        });
      }
    });
  }
}
