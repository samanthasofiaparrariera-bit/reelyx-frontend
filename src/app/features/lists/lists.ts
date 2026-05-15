import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ListasService } from '../../core/services/listas/listas.service';

@Component({
  selector: 'app-lists',
  imports: [],
  templateUrl: './lists.html',
  styleUrl: './lists.scss',
})
export class Lists {
  listas: any;

  constructor(private listasService: ListasService, private router: Router) {
    this.listasService.cargarListas();
    this.listas = this.listasService.getListas();
  }

  // la foto de perfil
  getUserImage(lista: any) {
    if (!lista.usuario_pfp) {
      return '';
    }
    if (lista.usuario_pfp.startsWith('http')) {
      return lista.usuario_pfp;
    }
    return `https://reelyx-backend-9nic.onrender.com${lista.usuario_pfp}`;
  }

  getPeliculaImage(peli: any) {
    if (!peli.imagen) {
      return '';
    }
    if (peli.imagen.startsWith('http')) {
      return peli.imagen;
    }


    return `https://reelyx-backend-9nic.onrender.com${peli.imagen}`;
  }

  irPerfil(email: string) {
    sessionStorage.setItem('profile_email', email);
    this.router.navigate(['/profile']);
  }

  irListDetail(id: string) {

    sessionStorage.setItem('list_detail_id', String(id));
    this.router.navigate(['/list-detail']);
  }
}
