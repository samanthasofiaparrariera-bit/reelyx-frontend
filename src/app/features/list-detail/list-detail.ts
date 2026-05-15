import {Component, signal} from '@angular/core';
import {Router} from '@angular/router';
import {ListasService} from '../../core/services/listas/listas.service';
import Swal from 'sweetalert2';
import {FormsModule} from '@angular/forms';
// Proyecto: Reelyx
// Autora: Samantha Sofía Parra Riera
// Descripción: Componente encargado de mostrar, editar y eliminar listas de películas.

@Component({
  selector: 'app-list-detail',
  imports: [
    FormsModule,
  ],
  templateUrl: './list-detail.html',
  styleUrl: './list-detail.scss',
})
export class ListDetail {
  listas: any;
  lista = signal<any>(null);

  modoEditar = false;
  // hago una copia de las pelis que hay en la lista y hago cambios ahi
  // los cambios reales se realizan si se confirman
  peliculasEditadas: any[] = [];

  constructor(private listasService: ListasService, private router: Router) {
  // Recuperamos el id de la lista seleccionada
    const idLista = sessionStorage.getItem('list_detail_id');

    this.listasService.cargarListas();
    this.listas = this.listasService.getListas();

    setTimeout(() => {
      // Buscamos la lista dentro de las listas cargadas
      const encontrada = this.listas().find((lista: any) =>
        String(lista.id) === idLista
      );

      this.lista.set(encontrada ?? null);

      // Creamos una copia temporal para editar películas sin guardar directamente
      if (encontrada) {
        this.peliculasEditadas = [...encontrada.peliculas_detalle];
      }
    }, 500);
  }

  // modo editar
  activarEditar() {
    this.modoEditar = true;
  }

  cancelarEditar() {
    this.modoEditar = false;

    if (this.lista()) {
      this.peliculasEditadas = [...this.lista().peliculas_detalle];
    }
  }

  // Quitamos la película SOLO  de la vista temporal hasta confirmar los cambios
  quitarPelicula(idPeli: number) {
    this.peliculasEditadas = this.peliculasEditadas.filter((peli: any) =>
      peli.id !== idPeli
    );
  }

  confirmarCambios() {
  //Convertimos las películas editadas en una lista de ids para enviarla al backend
    const peliculasIds = this.peliculasEditadas.map((peli: any) => peli.id);

  // Guardamos los cambios realizados en la lista
    this.listasService.actualizarLista(
      this.lista().id, this.lista().nombre, this.lista().descripcion,
      peliculasIds
    ).subscribe({

      next: (response: any) => {

        this.lista.set(response.data);
        this.peliculasEditadas = [...response.data.peliculas_detalle];
        this.modoEditar = false;

        Swal.fire({
          icon: 'success',
          title: 'Lista actualizada',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff'
        });

      },

      error: (error: any) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo actualizar la lista',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff'
        });
      }
    });

  }

  estaLogueado() {
    return document.cookie.includes('reelyx_token');
  }

  // ELIMINAR LISTA
  // ****************

  async eliminarLista() {

  // Pedimos confirmación antes de eliminar una lista definitivamente
    const result = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar lista?',
      text: 'Esta acción no se podrá deshacer.',
      background: '#151315',
      color: '#ffffff',
      confirmButtonColor: '#884aff',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      confirmButtonText: 'Eliminar'
    });

    if (!result.isConfirmed) {
      return;
    }

    this.listasService.eliminarLista(this.lista().id).subscribe({
      next: () => {
        this.listasService.quitarListaDeSignal(this.lista().id);

        Swal.fire({
          icon: 'success',
          title: 'Lista eliminada',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff'
        });

        this.router.navigate(['/profile']);
      },

      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo eliminar la lista',
          background: '#151315',
          color: '#ffffff',
          confirmButtonColor: '#884aff'
        });
      }
    });
  }

  esDuenoLista() {
    const token = document.cookie.includes('reelyx_token');

    if (!token || !this.lista()) {
      return false;
    }
    // Comprobamos si el usuario logueado es el dueño de la lista
    return this.lista().usuario_email === sessionStorage.getItem('user_email');
  }


  // navigate de filmdetail por si le dan a una pelicula

  irFilmDetail(nombre: string) {
    sessionStorage.setItem('film_detail_name', nombre);
    this.router.navigate(['/film-detail']);
  }

  // Recogemos las imagenes de las películas.
  getPeliculaImage(peli: any) {
    if (!peli.imagen) {
      return '';
    }

    if (peli.imagen.startsWith('http')) {
      return peli.imagen;
    }

    return `https://reelyx-backend-9nic.onrender.com${peli.imagen}`;
  }

  // PFP
  getUserImage(lista: any) {

    if (!lista.usuario_pfp) {
      return '';
    }

    if (lista.usuario_pfp.startsWith('http')) {
      return lista.usuario_pfp;
    }

    return `https://reelyx-backend-9nic.onrender.com${lista.usuario_pfp}`;
  }


}
