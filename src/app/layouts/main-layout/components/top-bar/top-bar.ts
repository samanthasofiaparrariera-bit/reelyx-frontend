import { Component, ElementRef, HostListener } from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {AuthService} from '../../../../core/services/usuarios/auth.service';
import {AuthCookieService} from '../../../../core/services/cookies/auth-cookie.service';

@Component({
  selector: 'app-top-bar',
  imports: [
    RouterLink,
    FormsModule
  ],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.scss',
})
export class TopBar {
  // searchText: string = '';
  // Este boolean me dice si el desplegable esta abierto o no, siempre comienza en falso
  menuUser: boolean = false;


  constructor(private router: Router, private authCookieService: AuthCookieService, private elementRef: ElementRef) {}
  // on/off
  toggleMenuUser() {
    this.menuUser = !this.menuUser;
  }

  logout() {
    // hacemos un log out eliminando el token
    this.authCookieService.remove('reelyx_token');
    this.menuUser = false;
    this.router.navigate(['/']);
  }
  // Función para cerrar menu si haces click fuera
  @HostListener('document:click', ['$event'])
  closeMenuClick(event: Event) {
    const clickDentro = this.elementRef.nativeElement.contains(event.target);

    if (!clickDentro) {
      this.menuUser = false;
    }
  }
  // se comprueba si el usuario ha iniciado sesión o no
  estaLogueado() {
    return this.authCookieService.exists('reelyx_token');
  }
    //   Ir a mi propio perfil

  irMiPerfil() {
    sessionStorage.removeItem('profile_email');
    this.menuUser = false;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/profile']);
    });
  }

//   FUNCIÓN PARA BUSCAR PELIS
//   buscar() {
//   sessionStorage.setItem('search', this.searchText);
//   this.router.navigate(['/films'])
//   }
}
